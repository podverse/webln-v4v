<svelte:options tag="webln-v4v" />

<script lang="ts">
	/**
	 * WebLN on-page widget
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

	let webcomponentElement: HTMLElement | null = null;

	let amountMin: number | null;
	let amountMax: number | null;
	let appName: string | null;
	let appRecipientCustomKey: string | null;
	let appRecipientCustomValue: string | null;
	let appRecipientLNAddress: string | null;
	let appRecipientLabel: string | null;
	let appRecipientValue: number | null;
	let contentType: string | null;
	let hasAcceptedTerms: boolean | null;
	let hasRejectedTerms: boolean | null;
	let headerText: string | null;
	let messageLabel: string | null;
	let messagePlaceholder: string | null;
	let podcastEpisodeTitle: string | null;
	let podcastPodcastIndexId: number | null;
	let podcastTitle: string | null;
	let recipientLabel: string | null;
	let recipientValue: number | null;
	let sendButtonLabel: string | null;
	let sendButtonSentLabel: string | null;
	let senderName: string | null;
	let senderNameLabel: string | null;
	let v4vString: any;

	let boostIsSending: boolean;
	let boostWasSent: boolean;
	let errorMessage: string;
	let lnpayTermsAccepted: boolean;
	let lnpayTermsRejected: boolean;
	let message: string;
	let showMoreInfo: boolean;
	let termsAcceptCheckboxValue: boolean;

	let boostPromises: any[] = [];
	let normalizedRecipients: ValueRecipientNormalized[] = [];

	let lnpayInitialized = false;

	const getRecipientLabel = (recipient_label?: string | null) => {
		let recipientLabel = "Content Creator";
		if (recipient_label) {
			recipientLabel = recipient_label;
		} else if (contentType === "podcast") {
			recipientLabel = "Podcaster";
		}
		return recipientLabel;
	};

	const initializeVariables = () => {
		webcomponentElement = document.querySelector("webln-v4v");
		const amount_max = webcomponentElement?.getAttribute("amount_max");
		const amount_min = webcomponentElement?.getAttribute("amount_min");
		const app_name = webcomponentElement?.getAttribute("app_name");
		const app_recipient_custom_key = webcomponentElement?.getAttribute("app_recipient_custom_key");
		const app_recipient_custom_value = webcomponentElement?.getAttribute("app_recipient_custom_value");
		const app_recipient_ln_address = webcomponentElement?.getAttribute("app_recipient_ln_address");
		const app_recipient_label = webcomponentElement?.getAttribute("app_recipient_label");
		const app_recipient_value_default = webcomponentElement?.getAttribute("app_recipient_value_default");
		const content_type = webcomponentElement?.getAttribute("content_type");
		const has_accepted_terms = webcomponentElement?.getAttribute("has_accepted_terms");
		const has_rejected_terms = webcomponentElement?.getAttribute("has_rejected_terms");
		const header_text = webcomponentElement?.getAttribute("header_text");
		const message_label = webcomponentElement?.getAttribute("message_label");
		const message_placeholder = webcomponentElement?.getAttribute("message_placeholder");
		const podcast_episode_title = webcomponentElement?.getAttribute("podcast_episode_title");
		const podcast_podcast_index_id = webcomponentElement?.getAttribute("podcast_podcast_index_id");
		const podcast_title = webcomponentElement?.getAttribute("podcast_title");
		const recipient_label = webcomponentElement?.getAttribute("recipient_label");
		const recipient_value_default = webcomponentElement?.getAttribute("recipient_value_default");
		const send_button_label = webcomponentElement?.getAttribute("send_button_label");
		const send_button_sent_label = webcomponentElement?.getAttribute("send_button_sent_label");
		const sender_name = webcomponentElement?.getAttribute("sender_name");
		const sender_name_label = webcomponentElement?.getAttribute("sender_name_label");
		const v4v_tag = webcomponentElement?.getAttribute("v4v_tag");

		amountMin = parseInt(amount_min, 10) || 0;
		amountMax = parseInt(amount_max, 10) || 500000;
		appName = app_name || "Unknown App";
		appRecipientCustomKey = app_recipient_custom_key || "";
		appRecipientCustomValue = app_recipient_custom_value || "";
		appRecipientLNAddress = app_recipient_ln_address || "";
		appRecipientLabel = app_recipient_label || "App";
		appRecipientValue = parseInt(app_recipient_value_default, 10) || 0;
		contentType = content_type || "";
		hasAcceptedTerms = has_accepted_terms === "true";
		hasRejectedTerms = has_rejected_terms === "true";
		headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
		messageLabel = message_label || "Boostagram";
		messagePlaceholder = message_placeholder || "optional public message";
		podcastEpisodeTitle = podcast_episode_title || "Untitled Episode";
		podcastPodcastIndexId = parseInt(podcast_podcast_index_id, 10) || null;
		podcastTitle = podcast_title || "Untitled Podcast";
		recipientLabel = getRecipientLabel(recipient_label);
		recipientValue = parseInt(recipient_value_default, 10) || 0;
		sendButtonLabel = send_button_label || "Send Boost";
		sendButtonSentLabel = send_button_sent_label || "Boost Sent!";
		senderName = sender_name || "";
		senderNameLabel = sender_name_label || "Your Name";
		v4vString = v4v_tag;

		boostIsSending = false;
		boostWasSent = false;
		errorMessage = "";
		lnpayTermsAccepted = hasAcceptedTerms;
		lnpayTermsRejected = hasRejectedTerms;
		message = "";
		showMoreInfo = false;
		termsAcceptCheckboxValue = false;

		boostPromises = [];
		normalizedRecipients = [];
	};

	const initialize = async () => {
		initializeVariables();
		// check if the user has webln and keysend (currently Alby)
		lnpayInitialized = !(typeof window.webln === "undefined" || !window.webln.keysend);

		if (lnpayInitialized && v4vString) {
			try {
				const valueTag: ValueTag = JSON.parse(v4vString);
				prepareBoostPromises(valueTag);
			} catch (error) {
				errorMessage = "Invalid v4v data.";
			}
		}

		setTimeout(() => {
			if (lnpayTermsAccepted) {
				enableWebLN();
			}
		}, 1500);

		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === "attributes") {
					console.log("attribute changed");
					initialize();
				}
			});
		});

		if (webcomponentElement) {
			observer.observe(webcomponentElement, {
				attributes: true,
			});
		}
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

		dispatchEvent(
			new CustomEvent("WebLN-V4V-Terms-Accepted", {
				bubbles: true,
				cancelable: false,
				composed: true,
			}),
		);
	};

	const rejectTerms = () => {
		dispatchEvent(
			new CustomEvent("WebLN-V4V-Terms-Rejected", {
				bubbles: true,
				cancelable: false,
				composed: true,
			}),
		);

		lnpayTermsRejected = true;
	};

	const calculateNormalizedSplits = (recipients: ValueRecipient[]) => {
		let normalizedValueRecipients: ValueRecipientNormalized[] = [];

		const totalSplit = recipients.reduce((total, recipient) => {
			return total + parseFloat(recipient.split);
		}, 0);

		normalizedValueRecipients = recipients.map((recipient) => {
			let normalizedSplit = (parseFloat(recipient.split) / totalSplit) * 100;
			normalizedSplit = parseFloat(normalizedSplit.toFixed(1));

			return {
				...recipient,
				normalizedSplit,
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

	export const normalizeValueRecipients = (recipients: ValueRecipient[], total: number) => {
		const normalizedValueRecipients: ValueRecipientNormalized[] = calculateNormalizedSplits(recipients);

		const finalNormalizedValueRecipients: ValueRecipientNormalized[] = [];
		for (const normalizedValueRecipient of normalizedValueRecipients) {
			let amount = (total / 100) * (normalizedValueRecipient.normalizedSplit || 0);

			amount = amount > 1 ? Math.floor(amount) : amount;

			finalNormalizedValueRecipients.push({
				...normalizedValueRecipient,
				amount: parseFloat(amount.toFixed(2)),
			});
		}

		return finalNormalizedValueRecipients;
	};

	const generateBoost = (valueSATTotal: number, name: string) => {
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
			normalizedRecipients = normalizeValueRecipients(recipients, recipientValue);

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
					const boost = generateBoost(appRecipientValue, appName);
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

	const showTerms = () => {
		lnpayTermsAccepted = false;
		lnpayTermsRejected = false;
	};

	const sendBoost = async () => {
		boostIsSending = true;

		for (const boostPromise of boostPromises) {
			try {
				await boostPromise();
			} catch (error) {
				console.log("Boost failed:", error);
			}
		}

		boostIsSending = false;
		boostWasSent = true;

		setTimeout(() => {
			boostWasSent = false;
		}, 3000);
	};

	/* These will regenerate the boost promises whenever an amount input value changes */
	const handleRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4vString);
		recipientValue = val;
		prepareBoostPromises(valueTag);
		dispatchNewDefaultFormValues();
	};

	const handleAppRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4vString);
		appRecipientValue = val;
		prepareBoostPromises(valueTag);
		dispatchNewDefaultFormValues();
	};

	const handleSenderNameOnChange = (val: string) => {
		const valueTag: ValueTag = JSON.parse(v4vString);
		senderName = val;
		prepareBoostPromises(valueTag);
		dispatchNewDefaultFormValues();
	};

	const handleMessageOnBlur = (val: string) => {
		const valueTag: ValueTag = JSON.parse(v4vString);
		message = val;
		prepareBoostPromises(valueTag);
	};

	const dispatchNewDefaultFormValues = () => {
		dispatchEvent(
			new CustomEvent("WebLN-V4V-New-Default-Values", {
				bubbles: true,
				cancelable: false,
				composed: true,
				detail: {
					defaultAppAmount: appRecipientValue,
					defaultContentCreatorAmount: recipientValue,
					defaultSenderName: senderName,
				},
			}),
		);
	};

	/*
        TODO: Instead of a setTimeout, we should listen for a "webln is loaded" event.
        I don't think one exists at the moment.
    */

	initialize();
</script>

<div id="webln-v4v" part="webln-v4v">
	{#if lnpayTermsRejected}
		<div class="buttons-wrapper align-left">
			<button class="primary" id="show-terms" on:click={showTerms} type="button"> Show Menu </button>
		</div>
	{/if}
	{#if !lnpayTermsRejected}
		{#if errorMessage}
			{`ERROR: ${errorMessage}`}
		{/if}
		{#if !lnpayTermsAccepted && !errorMessage}
			<p>
				This widget connects to your WebLN compatible browser extension to allow you to send Bitcoin over the
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
				<a href="https://github.com/podverse/webln-v4v" target="_blank">Source Code</a>
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
					<label for="sender-name">{senderNameLabel}</label>
					<span>
						<input
							id="sender-name"
							on:input={(event) => handleSenderNameOnChange(event.target.value)}
							placeholder="optional"
							type="text"
							value={senderName}
						/>
					</span>
				</div>
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
								<th class="no-wrap">%</th>
								<th class="no-wrap">Total</th>
							</tr>
							{#each normalizedRecipients as recipient}
								<tr>
									<td
										>{recipient.name}
										<div class="address">{recipient.address}</div>
										{#if recipient.customKey}
											<div class="custom-key">Key: {recipient.customKey}</div>
										{/if}
										{#if recipient.customValue}
											<div class="custom-value">Value: {recipient.customValue}</div>
										{/if}
									</td>
									<td class="center no-wrap">{recipient.normalizedSplit}</td>
									<td class="center no-wrap">{recipient.amount}{recipient.amount < 10 ? "*" : ""}</td>
								</tr>
							{/each}
							{#if appRecipientLNAddress && appRecipientValue > 0}
								<tr>
									<td
										>{appName}
										<div class="address">{appRecipientLNAddress}</div>
										{#if appRecipientCustomKey}
											<div class="custom-key">Key: {appRecipientCustomKey}</div>
										{/if}
										{#if appRecipientCustomValue}
											<div class="custom-value">Value: {appRecipientCustomValue}</div>
										{/if}
									</td>
									<td class="center" />
									<td class="center no-wrap"
										>{appRecipientValue}{appRecipientValue < 10 ? "*" : ""}</td
									>
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
