<svelte:options tag="lnurl-widget" />

<script lang="ts">
	/**
	 * LNURL on-page widget
	 * =====================
	 *
	 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
	 *
	 * @license: MIT License
	 *
	 */
	// import webcomponent from "@app/functions/webcomponent";
	// import { translate } from "@app/translations/translate";
	import { v4 as uuidv4 } from "uuid";

	type ValueTag = {
		method: string;
		suggested: string;
		type: string;
		recipients: ValueRecipient[];
	};

	type ValueRecipient = {
		address: string;
		customKey?: string;
		customValue?: any;
		fee?: boolean | null;
		name?: string;
		split: number | string;
		type: string;
	};

	type ValueRecipientNormalized = {
		address: string;
		amount: number;
		customKey?: string;
		customValue?: any;
		fee?: boolean | null;
		name?: string;
		normalizedSplit: number;
		split: number | string;
		type: string;
	};

	export let amount_max: string;
	export let amount_min: string;
	export let app_name: string;
	export let app_recipient_custom_key: string;
	export let app_recipient_custom_value: string;
	export let app_recipient_ln_address: string;
	export let app_recipient_label: string;
	export let app_recipient_value_default: string;
	export let content_type: string;
	export let has_accepted_terms: string;
	export let header_text: string;
	export let message_label: string;
	export let message_placeholder: string;
	export let podcast_episode_title: string;
	export let podcast_podcast_index_id: string;
	export let podcast_title: string;
	export let recipient_label: string;
	export let recipient_value_default: string;
	export let send_button_label: string;
	export let send_button_sent_label: string;
	export let sender_name: string;
	export let v4v_tag: string;

	let amountMin = amount_min || 0;
	let amountMax = amount_max || 500000;
	let appName = app_name || "Unknown App";
	let appRecipientCustomKey = app_recipient_custom_key || "";
	let appRecipientCustomValue = app_recipient_custom_value || "";
	let appRecipientLNAddress = app_recipient_ln_address || "";
	let appRecipientLabel = app_recipient_label || "App";
	let appRecipientValue = parseInt(app_recipient_value_default, 10) || 0;
	let contentType = content_type || "";
	let hasAcceptedTerms = has_accepted_terms === "true";
	let headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
	let messageLabel = message_label || "Boostagram";
	let messagePlaceholder = message_placeholder || "(optional public message)";
	let message = "";
	let podcastEpisodeTitle = podcast_episode_title || "Untitled Episode";
	let podcastPodcastIndexId = parseInt(podcast_podcast_index_id, 10) || null;
	let podcastTitle = podcast_title || "Untitled Podcast";
	let recipientValue = parseInt(recipient_value_default, 10) || 0;
	let sendButtonLabel = send_button_label || "Send Boost";
	let sendButtonSentLabel = send_button_sent_label || "Boost Sent!";
	let senderName = sender_name || "Anonymous";

	let boostIsSending = false;
	let boostWasSent = false;
	let errorMessage = "";
	let isInitialLoad = true;
	let lnpayInitialized = false;
	let lnpayTermsAccepted = hasAcceptedTerms;
	let lnpayTermsRejected = false;
	let showMoreInfo = false;
	let termsAcceptCheckboxValue = false;

	let boostPromises: any[] = [];
	let normalizedRecipients: ValueRecipientNormalized[] = [];

	const getRecipientLabel = () => {
		let recipientLabel = "Content Creator";
		if (recipient_label) {
			recipientLabel = recipient_label;
		} else if (contentType === "podcast") {
			recipientLabel = "Podcaster";
		}
		return recipientLabel;
	};

	let recipientLabel = getRecipientLabel();

	const initialize = () => {
		isInitialLoad = false;
		// check if the user has webln and keysend (currently Alby)
		return !(typeof window.webln === "undefined" || !window.webln.keysend);
	};

	const enableWebLN = async () => {
		if (!errorMessage) {
			try {
				// enable webln / request website permission
				await webln.enable();
			} catch (error) {
				errorMessage = "User denied permission or cancelled.";
				throw new Error(errorMessage);
			}
		}
	};

	const acceptTermsAndContinue = async () => {
		await enableWebLN();
		lnpayTermsAccepted = true;

		dispatchEvent(new CustomEvent("LNURL-Widget-Terms-Accepted", { bubbles: true }));
	};

	const rejectTerms = () => {
		lnpayTermsRejected = true;
	};

	const calculateNormalizedSplits = (recipients: ValueRecipient[]) => {
		let normalizedValueRecipients: ValueRecipientNormalized[] = [];

		const totalSplit = recipients.reduce((total, recipient) => {
			return total + parseFloat(recipient.split);
		}, 0);

		normalizedValueRecipients = recipients.map((recipient) => {
			return {
				...recipient,
				normalizedSplit: (parseFloat(recipient.split) / totalSplit) * 100,
				amount: 0, // TODO: hacky code. This will get set in normalizeValueRecipients.
			};
		});

		normalizedValueRecipients = normalizedValueRecipients.filter((x) => isValidNormalizedValueRecipient(x));

		return normalizedValueRecipients;
	};

	const isValidNormalizedValueRecipient = (normalizedValueRecipient: ValueRecipientNormalized) =>
		!!(
			normalizedValueRecipient?.address &&
			normalizedValueRecipient?.amount >= 0 && // TODO: this shouldn't allow 0
			normalizedValueRecipient?.normalizedSplit > 0 &&
			normalizedValueRecipient?.split > 0 &&
			normalizedValueRecipient?.type
		);

	export const normalizeValueRecipients = (recipients: ValueRecipient[], total: number, roundDownValues: boolean) => {
		const normalizedValueRecipients: ValueRecipientNormalized[] = calculateNormalizedSplits(recipients);
		const feeRecipient = normalizedValueRecipients.find((valueRecipient) => valueRecipient.fee === true);
		let feeAmount = 0;
		if (feeRecipient) {
			feeAmount = (total / 100) * (feeRecipient.normalizedSplit || 0);
			total = total - feeAmount;
		}

		const finalNormalizedValueRecipients: ValueRecipientNormalized[] = [];
		for (const normalizedValueRecipient of normalizedValueRecipients) {
			let amount = (total / 100) * (normalizedValueRecipient.normalizedSplit || 0);

			if (feeAmount && normalizedValueRecipient.fee) {
				amount = feeAmount;
			}

			amount = roundDownValues ? Math.floor(amount) : amount;

			finalNormalizedValueRecipients.push({
				...normalizedValueRecipient,
				amount: parseFloat(amount.toFixed(2)),
			});
		}

		return finalNormalizedValueRecipients;
	};

	const generateBoost = (valueSATTotal: number, name) => {
		let boost: any = {
			action: "boost",
			value_msat_total: valueSATTotal * 1000,
			app_name: appName,
			sender_name: senderName,
			name,
			message,
		};

		// Enrich with SatoshiStreamStats values
		if (contentType === "podcast") {
			boost = {
				...boost,
				podcast: podcastTitle,
				episode: podcastEpisodeTitle,
			};
		}

		return boost;
	};

	const generateKeysendBody = (
		address: string,
		amount: number,
		boost: any,
		customKey: string,
		customValue: string,
	) => {
		if (!address || amount < 10) return;

		let keysend: any = {
			destination: address,
			amount,
			customRecords: {
				"7629169": JSON.stringify(boost),
				// A random uuid MUST be assigned to 5482373484.
				"5482373484": uuidv4(),
				/* 
                    Some Lightning wallets MUST have a customKey and customValue,
                    or the funds will be lost (they'll end up with the Lightning node operator)
                    instead of the intended wallet recipient.
                */
				...(customKey && customValue ? { [customKey]: customValue } : {}),
			},
		};

		if (contentType === "podcast") {
			if (podcastPodcastIndexId) {
				keysend.customRecords["7629175"] = podcastPodcastIndexId;
			}
		}

		return keysend;
	};

	const prepareBoostPromises = (valueTag: ValueTag) => {
		try {
			boostPromises = [];
			const { recipients } = valueTag;
			const roundDownValues = true;
			normalizedRecipients = normalizeValueRecipients(recipients, recipientValue, roundDownValues);

			if (
				valueTag.type === "lightning" &&
				valueTag.method === "keysend" &&
				valueTag.recipients &&
				valueTag.recipients.length > 0
			) {
				for (const recipient of normalizedRecipients) {
					const { address, amount, customKey, customValue, name } = recipient;
					const boost = generateBoost(amount, name);
					const keysendBody = generateKeysendBody(address, amount, boost, customKey, customValue);

					if (keysendBody) {
						boostPromises.push(() => webln.keysend(keysendBody));
					}
				}

				if (appRecipientLNAddress && appRecipientValue >= 10) {
					const boost = generateBoost(appRecipientValue, app_name);
					const keysendBody = generateKeysendBody(
						appRecipientLNAddress,
						appRecipientValue,
						boost,
						appRecipientCustomKey,
						appRecipientCustomValue,
					);

					if (keysendBody) {
						boostPromises.push(() => webln.keysend(keysendBody));
					}
				}
			} else {
				errorMessage = "Invalid v4v data.";
				throw new Error(errorMessage);
			}
		} catch (error: any) {
			errorMessage = error.message;
			boostPromises = [];
		}
	};

	const toggleShowMoreInfo = () => {
		showMoreInfo = !showMoreInfo;
	};

	const sendBoost = async () => {
		boostIsSending = true;

		for (const boostPromise of boostPromises) {
			await boostPromise();
		}

		boostIsSending = false;
		boostWasSent = true;

		setTimeout(() => {
			boostWasSent = false;
		}, 3000);
	};

	/* These will regenerate the boost promises whenever an amount input value changes */
	const handleRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		recipientValue = val;
		prepareBoostPromises(valueTag);
	};

	const handleAppRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		appRecipientValue = val;
		prepareBoostPromises(valueTag);
	};

	const handleMessageOnBlur = (val: string) => {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		message = val;
		prepareBoostPromises(valueTag);
	};

	/*
        TODO: Instead of a setTimeout, we should listen for a "lnurl is loaded" event.
        I don't think one exists at the moment.
    */
	setTimeout(async () => {
		lnpayInitialized = initialize();

		if (lnpayTermsAccepted) {
			await enableWebLN();
		}

		if (lnpayInitialized && v4v_tag) {
			try {
				const valueTag: ValueTag = JSON.parse(v4v_tag);
				prepareBoostPromises(valueTag, recipientValue, appRecipientValue);
			} catch (error) {
				errorMessage = "Invalid v4v data.";
			}
		}
	}, 1500);
</script>

<div id="lnurl-widget" part="lnurl-widget">
	{#if isInitialLoad}
		<div class="loader" />
	{/if}
	{#if !isInitialLoad && lnpayInitialized && !lnpayTermsRejected}
		{#if errorMessage}
			{`ERROR: ${errorMessage}`}
		{/if}
		{#if !lnpayTermsAccepted && !errorMessage}
			<p>
				This widget connects to your LNURL compatible browser extension to allow you to send Bitcoin over the
				Lightning Network to content creators.
			</p>
			<p>
				This is an experimental feature, we are not responsible for lost, misdirected, or stolen funds, and you
				assume all responsibility for the risks associated with using this feature.
			</p>
			<div class="checkbox-wrapper">
				<input
					bind:checked={termsAcceptCheckboxValue}
					id="accept-checkbox"
					name="accept-checkbox"
					type="checkbox"
				/>
				<label for="accept-checkbox">I understand the risks and accept.</label>
			</div>
			<div class="buttons-wrapper">
				<button class="secondary" on:click={rejectTerms} type="button">Cancel</button>
				<button
					class="primary"
					disabled={!termsAcceptCheckboxValue}
					on:click={acceptTermsAndContinue}
					type="button">I Accept</button
				>
			</div>
			<div class="links-wrapper">
				<a href="https://github.com/podverse/lnurl-widget" target="_blank">Source Code</a>
			</div>
		{/if}
		{#if lnpayTermsAccepted && !errorMessage}
			<form on:submit|preventDefault={sendBoost}>
				<p>{headerText}</p>
				<div class="input-wrapper">
					<label for="content-creator-amount">{recipientLabel}</label>
					<span>
						<input
							id="content-creator-amount"
							max={amountMax}
							min={amountMin}
							on:input={(event) => handleRecipientAmountOnChange(event.target.value)}
							type="number"
							value={recipientValue}
						/>
						<span class="input-denomination"> satoshis</span>
					</span>
				</div>
				{#if appRecipientLNAddress}
					<div class="input-wrapper">
						<label for="app-amount">{appRecipientLabel}</label>
						<span>
							<input
								id="app-amount"
								max={amountMax}
								min={amountMin}
								on:input={(event) => handleAppRecipientAmountOnChange(event.target.value)}
								type="number"
								value={appRecipientValue}
							/>
							<span class="input-denomination"> satoshis</span>
						</span>
					</div>
				{/if}
				<div class="input-wrapper">
					<label for="boostagram">{messageLabel}</label>
					<textarea
						id="boostagram"
						on:blur={(event) => handleMessageOnBlur(event.target.value)}
						placeholder={messagePlaceholder}
						rows="4"
						bind:value={message}
					/>
				</div>
				<div class="buttons-wrapper">
					<button class="primary" disabled={boostIsSending} type="submit">
						{#if !boostIsSending}
							<span>{boostWasSent ? sendButtonSentLabel : sendButtonLabel}</span>
						{/if}
						{#if boostIsSending}
							<div class="loader" />
						{/if}
					</button>
				</div>
				<div class="more-info-wrapper">
					<button class="show-more" on:click={toggleShowMoreInfo} type="button">
						{#if !showMoreInfo}
							<span>▸</span>
						{/if}
						{#if showMoreInfo}
							<span>▾</span>
						{/if}
						Show More Info
					</button>
					{#if showMoreInfo}
						<table class="splits-table">
							<tr>
								<th>Name / Address</th>
								<th>Split</th>
								<th>Total Sats</th>
							</tr>
							{#each normalizedRecipients as recipient}
								<tr>
									<td
										>{recipient.name}
										<div class="address">{recipient.address}</div>
										{#if recipient.customKey}
											<div class="custom-key">Custom Key: {recipient.customKey}</div>
										{/if}
										{#if recipient.customValue}
											<div class="custom-value">Custom Value: {recipient.customValue}</div>
										{/if}
									</td>
									<td class="center">{recipient.normalizedSplit}</td>
									<td class="center">{recipient.amount}{recipient.amount < 10 ? "*" : ""}</td>
								</tr>
							{/each}
							{#if appRecipientLNAddress && appRecipientValue > 0}
								<tr>
									<td
										>{appName}
										<div class="address">{appRecipientLNAddress}</div>
										{#if appRecipientCustomKey}
											<div class="custom-key">Custom Key: {appRecipientCustomKey}</div>
										{/if}
										{#if appRecipientCustomValue}
											<div class="custom-value">Custom Value: {appRecipientCustomValue}</div>
										{/if}
									</td>
									<td class="center" />
									<td class="center">{appRecipientValue}{appRecipientValue < 10 ? "*" : ""}</td>
								</tr>
							{/if}
						</table>
						<div class="helper-text">
							* If a total is less than 10 sats, the transaction will not be sent.
						</div>
					{/if}
				</div>
			</form>
		{/if}
	{/if}
</div>

<style lang="scss">
	@import "../styles/webcomponent.scss";
</style>
