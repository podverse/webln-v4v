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
	export let header_text: string;
	export let message_label: string;
	export let message_placeholder: string;
	export let name: string;
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
	let appRecipientValue = app_recipient_value_default || 0;
	let headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
	let messageLabel = message_label || "Boostagram";
	let messagePlaceholder = message_placeholder || "(optional message)";
	let message = "";
	let name2 = name || "Anonymous"; // not sure what "name" is for in Alby
	let recipientLabel = recipient_label || "Content Creator";
	let recipientValue = recipient_value_default || 0;
	let sendButtonLabel = send_button_label || "Send Boost!";
	let senderName = sender_name || "Anonymous";

	let errorMessage = "";
	let lnpayEnabled = false;
	let lnpayInitialized = false;
	let lnpayTermsAccepted = false;
	let lnpayTermsRejected = false;
	let termsAcceptCheckboxValue = false;

	let boostPromises = [];
	let normalizedRecipients = [];

	$: handleAppRecipientAmountOnChange(appRecipientValue);
	$: handleRecipientAmountOnChange(recipientValue);

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

	// const validateBoost = () => {
	// 	// if () {
	// 	// }
	// };

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
			normalizedValueRecipient?.amount > 0 &&
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

	const prepareBoostPromises = (v4v: any, newRecipientValue: number, newAppRecipientValue: number) => {
		try {
			boostPromises = [];
			recipientValue = newRecipientValue;
			appRecipientValue = newAppRecipientValue;
			const { recipients } = v4v;
			const roundDownValues = true;
			normalizedRecipients = normalizeValueRecipients(recipients, recipientValue, roundDownValues);

			if (v4v.type === "lightning" && v4v.method === "keysend" && v4v.recipients && v4v.recipients.length > 0) {
				for (const recipient of normalizedRecipients) {
					const boost = {
						action: "boost",
						value_msat_total: recipient.amount * 1000,
						app_name,
						sender_name,
						name: "satoshi",
						message,
					};

					const { address, amount } = recipient;
					if (address && amount >= 10) {
						boostPromises.push(
							webln.keysend({
								destination: address,
								amount,
								customRecords: {
									"7629169": JSON.stringify(boost),
								},
							}),
						);
					}
				}

				if (appRecipientLNAddress && appRecipientValue >= 10) {
					const boost = {
						action: "boost",
						value_msat_total: appRecipientValue,
						app_name,
						sender_name,
						name,
						message,
					};

					boostPromises.push(
						webln.keysend({
							destination: appRecipientLNAddress,
							amount: appRecipientValue,
							customRecords: {
								"7629169": JSON.stringify(boost),
							},
						}),
					);
				}
			} else {
				errorMessage = "Invalid v4v data.";
				throw new Error(errorMessage);
			}
		} catch (error: any) {
			errorMessage = error.message;
			return [];
		}
	};

	const handleRecipientAmountOnChange = (val: number) => {
		const v4vObject = JSON.parse(v4v_tag);
		boostPromises = prepareBoostPromises(v4vObject, recipientValue, appRecipientValue);
	};

	const handleAppRecipientAmountOnChange = (val: number) => {
		const v4vObject = JSON.parse(v4v_tag);
		boostPromises = prepareBoostPromises(v4vObject, recipientValue, appRecipientValue);
	};

	lnpayInitialized = initialize();

	if (lnpayInitialized && v4v_tag) {
		const v4vObject = JSON.parse(v4v_tag);
		boostPromises = prepareBoostPromises(v4vObject, recipientValue, appRecipientValue);
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
							on:input={handleRecipientAmountOnChange}
							type="number"
							bind:value={recipientValue}
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
							on:input={handleAppRecipientAmountOnChange}
							type="number"
							bind:value={appRecipientValue}
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
			</form>
		{/if}
	</div>
{/if}

<style lang="scss">
	@import "../styles/webcomponent.scss";
</style>
