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

	let amountMin = amount_min || 0;
	let amountMax = amount_max || 500000;
	let appName = app_name || "Unknown App";
	let appRecipientLNAdress = app_recipient_ln_address || "";
	let appRecipientLabel = app_recipient_label || "App";
	let appRecipientValue = app_recipient_value_default || 0;
	let headerText = header_text || "Send a Bitcoin donation to this content creator and app.";
	let messageLabel = message_label || "Boostagram";
	let messagePlaceholder = message_placeholder || "(optional message)";
	let name2 = name || "Anonymous"; // not sure what "name" is for in Alby
	let recipientLabel = recipient_label || "Content Creator";
	let recipientValue = recipient_value_default || 0;
	let sendButtonLabel = send_button_label || "Send Boost!";
	let senderName = sender_name || "Anonymous";

	let termsAcceptCheckboxValue = false;
	let termsAccepted = false;
	let termsRejected = false;

	const acceptTermsAndContinue = () => {
		termsAccepted = true;
	};

	const rejectTerms = () => {
		termsRejected = true;
	};

	const validateBoost = () => {
		// if () {
		// }
	};

	const sendBoost = () => {
		console.log("do validation");
		console.log("get values");
		console.log("send boost");
	};
</script>

{#if !termsRejected}
	<div id="webcomponent" part="webcomponent">
		{#if termsAccepted}
			<p>
				This widget connects to your LNURL compatible browser extension to allow you to send Bitcoin over the
				Lightning Network to content creators.
			</p>
			<p>
				This is an experimental feature, we make no guarantees of its reliability, we are not responsible for
				lost, misdirected, or stolen funds, and you assume all responsibility for the risks associated with
				using this feature.
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
		{#if !termsAccepted}
			<form on:submit|preventDefault={sendBoost}>
				<p>{headerText}</p>
				<div class="input-wrapper">
					<label for="content-creator-amount">{recipientLabel}</label>
					<span>
						<input
							type="number"
							id="content-creator-amount"
							min={amountMin}
							max={amountMax}
							value={recipientValue}
						/>
						<span class="input-denomination"> satoshis</span>
					</span>
				</div>
				<div class="input-wrapper">
					<label for="app-amount">{appRecipientLabel}</label>
					<span>
						<input
							type="number"
							id="app-amount"
							min={amountMin}
							max={amountMax}
							value={appRecipientValue}
						/>
						<span class="input-denomination"> satoshis</span>
					</span>
				</div>
				<div class="input-wrapper">
					<label for="boostagram">{messageLabel}</label>
					<textarea id="boostagram" placeholder={messagePlaceholder} />
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
