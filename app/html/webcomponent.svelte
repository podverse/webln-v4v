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
	export let app_recipient_ln_address: string;
	export let app_recipient_label: string;
	export let app_recipient_value_default: string;
	export let content_type: string;
	export let header_text: string;
	export let message_label: string;
	export let message_placeholder: string;
	export let name: string;
	export let podcast_episode_title: string;
	export let podcast_podcast_index_id: string;
	export let podcast_title: string;
	export let recipient_label: string;
	export let recipient_value_default: string;
	export let send_button_label: string;
	export let sender_name: string;
	export let v4v_tag: string;

	let amountMin = amount_min || 0;
	let amountMax = amount_max || 500000;
	let appName = app_name || "Unknown App";
	let appRecipientLNAddress = app_recipient_ln_address || "";
	let appRecipientLabel = app_recipient_label || "App";
	let appRecipientValue = parseInt(app_recipient_value_default, 10) || 0;
	let contentType = content_type || "";
	let headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
	let messageLabel = message_label || "Boostagram";
	let messagePlaceholder = message_placeholder || "(optional message)";
	let message = "";
	let name2 = name || "Anonymous"; // not sure what "name" is for in Alby, so calling it name2
	let podcastEpisodeTitle = podcast_episode_title || "Untitled Episode";
	let podcastPodcastIndexId = parseInt(podcast_podcast_index_id, 10) || null;
	let podcastTitle = podcast_title || "Untitled Podcast";
	let recipientValue = parseInt(recipient_value_default, 10) || 0;
	let sendButtonLabel = send_button_label || "Send Boost!";
	let senderName = sender_name || "Anonymous";

	let errorMessage = "";
	let lnpayEnabled = false;
	let lnpayInitialized = false;
	let lnpayTermsAccepted = false;
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
		// check if the user has webln and keysend (currently Alby)
		// return !(typeof window.webln === "undefined" || !window.webln.keysend);

		// TODO: add initialize check
		return true;
	};

	const enableWebLN = async () => {
		if (!errorMessage) {
			try {
				// enable webln / request website permission
				// TODO: disabling this for dev purposes for now
				// await webln.enable();
				lnpayEnabled = true;
			} catch (error) {
				errorMessage = "User denied permission or cancelled.";
				throw new Error(errorMessage);
			}
		}
	};

	const acceptTermsAndContinue = async () => {
		await enableWebLN();
		lnpayTermsAccepted = true;
	};

	const rejectTerms = () => {
		lnpayTermsRejected = true;
	};

	const sendBoost = () => {
		console.log("do validation", appRecipientValue);
		console.log("get values", recipientValue);
		console.log("send boost", message);
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

	const generateBoost = (valueSATTotal: number) => {
		let boost: any = {
			action: "boost",
			value_msat_total: valueSATTotal * 1000,
			app_name: appName,
			sender_name: senderName,
			name: name2,
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

	const generateKeysendBody = (address: string, amount: number, boost: any) => {
		if (address && amount >= 10) return;

		let keysend: any = {
			destination: address,
			amount,
			customRecords: {
				"7629169": JSON.stringify(boost),
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
					const { address, amount } = recipient;
					const boost = generateBoost(amount);
					const keysendBody = generateKeysendBody(address, amount, boost);
					if (keysendBody) {
						// boostPromises.push(webln.keysend(keysendBody));
					}
				}

				if (appRecipientLNAddress && appRecipientValue >= 10) {
					const boost = generateBoost(appRecipientValue);
					const keysendBody = generateKeysendBody(appRecipientLNAddress, appRecipientValue, boost);
					if (keysendBody) {
						// boostPromises.push(webln.keysend(keysendBody));
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

	/* These will regenerate the boost promises whenever an amount input value changes */
	const handleRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		recipientValue = val;
		boostPromises = prepareBoostPromises(valueTag, recipientValue, appRecipientValue);
	};

	const handleAppRecipientAmountOnChange = (val: number) => {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		appRecipientValue = val;
		boostPromises = prepareBoostPromises(valueTag, recipientValue, appRecipientValue);
	};

	lnpayInitialized = initialize();

	if (lnpayInitialized && v4v_tag) {
		const valueTag: ValueTag = JSON.parse(v4v_tag);
		prepareBoostPromises(valueTag, recipientValue, appRecipientValue);
	}
</script>

{#if lnpayInitialized && !lnpayTermsRejected}
	<div id="webcomponent" part="webcomponent">
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
				<button on:click={rejectTerms}>Cancel</button>
				<button disabled={!termsAcceptCheckboxValue} on:click={acceptTermsAndContinue}>I Accept</button>
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
				<div class="input-wrapper">
					<label for="boostagram">{messageLabel}</label>
					<textarea id="boostagram" placeholder={messagePlaceholder} bind:value={message} />
				</div>
				<div class="buttons-wrapper">
					<button type="submit">{sendButtonLabel}</button>
				</div>
				<div class="more-info-wrapper">
					<button class="show-more" on:click={toggleShowMoreInfo}>
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
									<td>{recipient.name}<br /><span class="address">{recipient.address}</span></td>
									<td class="center">{recipient.split}</td>
									<td class="center">{recipient.amount}{recipient.amount < 10 ? "*" : ""}</td>
								</tr>
							{/each}
							{#if appRecipientLNAddress && appRecipientValue > 0}
								<tr>
									<td>{appName}<br /><span class="address">{appRecipientLNAddress}</span></td>
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
	</div>
{/if}

<style lang="scss">
	@import "../styles/webcomponent.scss";
</style>
