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
	let appRecipientLNAdress = app_recipient_ln_address || "";
	let appRecipientLabel = app_recipient_label || "App";
	let appRecipientValue = app_recipient_value_default || 0;
	let headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
	let messageLabel = message_label || "Boostagram";
	let messagePlaceholder = message_placeholder || "(optional message)";
	let messageValue = "";
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

	const initialize = () => {
		// check if the user has webln and keysend (currently Alby)
		return !(typeof window.webln === "undefined" || !window.webln.keysend);
	};

	const enableWebLN = async () => {
		if (!errorMessage) {
			try {
				// enable webln / request website permission
				await window.webln.enable();
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
		console.log("send boost", messageValue);
	};

	// const validateBoost = () => {
	// 	// if () {
	// 	// }
	// };

	const parseV4VStringIntoBoostObjects = (v4vString: string) => {
		try {
			const v4vObject = JSON.parse(v4vString);

			if (
				v4vObject.type === "lightning" &&
				v4vObject.method === "keysend" &&
				v4vObject.recipients &&
				v4vObject.recipients.length > 0
			) {
				errorMessage = "Invalid v4v data.";
				throw new Error(errorMessage);
			}

			return ["asdf"];
		} catch (error: any) {
			errorMessage = error.message;
			return [];
		}
	};

	let boostObjects = [];
	lnpayInitialized = initialize();
	console.log("lnpayInitialized", lnpayInitialized);
	if (lnpayInitialized && v4v_tag) {
		boostObjects = parseV4VStringIntoBoostObjects(v4v_tag);
	}
</script>

{#if lnpayInitialized && boostObjects.length > 0 && !lnpayTermsRejected}
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
							type="number"
							bind:value={appRecipientValue}
						/>
						<span class="input-denomination"> satoshis</span>
					</span>
				</div>
				<div class="input-wrapper">
					<label for="boostagram">{messageLabel}</label>
					<textarea id="boostagram" placeholder={messagePlaceholder} bind:value={messageValue} />
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
