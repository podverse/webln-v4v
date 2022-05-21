# Quick Start Guide

The webln-v4v library is intended to make it easy to send Bitcoin Lightning Network boosts with a WebLN compatible browser extension using keysend.

## Supported Browser Extensions

[Alby](https://getalby.com)

others???

## Installation

Load the latest webln-v4v script on your webpage from CDN:

```
<script async="true" src="https://cdn.jsdelivr.net/npm/webln-v4v@latest/dist/webcomponent.js"></script>
```

If you'd like, you can replace `latest` with a specific version number.

## Add the webcomponent

Add the webln-v4v webcomponent wherever you want it to load on your page. Below is a minimal example.

```
<webln-v4v
    app_name="Podverse"
    v4v_tag='{"type":"lightning","method":"keysend","suggested":5e-8,"recipients":[{"name":"Podcastindex.org","type":"node","address":"03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a","split":"64","fee":false},{"name":"Dreb Scott (Chapters)","type":"node","address":"02453e4e93322d60219808c00c2e6d1f1c673420e95b5511a33c40cfb4df5e9148","split":"5","fee":false},{"name":"Sovereign Feeds","type":"node","address":"033868c219bdb51a33560d854d500fe7d3898a1ad9e05dd89d0007e11313588500","split":"5","fee":false,"customKey":"112111100","customValue":"wal_MB9T45QHGyW"},{"name":"Boostagram Monitor","type":"node","address":"038399372001f2741d58d6ec4846fccb78daa1a485e69e2eebc5aadba047d35956","split":"1","fee":false},{"name":"Podverse - Mitch Downey","type":"node","address":"033868c219bdb51a33560d854d500fe7d3898a1ad9e05dd89d0007e11313588500","split":"25","fee":false,"customKey":"112111100","customValue":"wal_1IdSsnirIIbdV4"}]}'
/>
```

A more detailed example can be [found here](https://github.com/podverse/webln-v4v/blob/main/public/index.html#L16-L28).

The `v4v_tag` attribute is based on the `<podcast:value>` namespace by Podcasting 2.0. To learn more about `<podcast:value>`, visit the [the spec documentation](https://github.com/Podcastindex-org/podcast-namespace/blob/main/value/value.md).

## Customize the webcomponent attributes (mostly optional)

You can customize various aspects of the webcomponent by setting the following attributes in the `<webln-v4v ... />` element:

| Attribute                   | Required    | Default                    | Definition                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ----------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount_max                  | no          | 500000                     | The default maximum value allowed for the content creator and app value inputs.                                                                                                                                                                                                                                                                                                                    |
| amount_min                  | no          | 0                          | The default minimum value allowed for the content creator and app value inputs.                                                                                                                                                                                                                                                                                                                    |
| app_name                    | recommended | Unknown App                | The name of the website hosting the webln-v4v component.                                                                                                                                                                                                                                                                                                                                           |
| app_recipient_custom_key    | no          |                            | This is for sending payments to the website hosting the webln-v4v component. Some LN addresses require a customKey and a customValue to be properly routed to their destination wallet.                                                                                                                                                                                                            |
| app_recipient_custom_value  | no          |                            | This is for sending payments to the website hosting the webln-v4v component. Some LN addresses require a customKey and a customValue to be properly routed to their destination wallet.                                                                                                                                                                                                            |
| app_recipient_ln_address    | no          |                            | This is for sending payments to the website hosting the webln-v4v component. If this field is empty, then the "App" input will not appear on the form.                                                                                                                                                                                                                                             |
| app_recipient_value_default | no          | 0                          | The default value for the "App" input.                                                                                                                                                                                                                                                                                                                                                             |
| content_type                | recommended |                            | Accepted param: "podcast". Setting the content_type will add some extra handling, like podcast related metadata that is submitted with the boosts.                                                                                                                                                                                                                                                 |
| has_accepted_terms          | no          | false                      | If set to true, then the "accept terms" step will be skipped.                                                                                                                                                                                                                                                                                                                                      |
| has_rejected_terms          | no          | false                      | If set to true, then the form will render in the "rejected terms" state. When a user rejects the terms, the form is hidden, and replaced with a button that says "Show Menu", which on press will show the "accept terms" form again.                                                                                                                                                              |
| header_text                 | no          | Send a Bitcoin donation... | The text that will appear at the top of the form.                                                                                                                                                                                                                                                                                                                                                  |
| message_label               | no          | Boostagram                 | The label for the "message" textarea input.                                                                                                                                                                                                                                                                                                                                                        |
| message_placeholder         | no          | optional public message    | The placeholder for the "message" textarea input.                                                                                                                                                                                                                                                                                                                                                  |
| podcast_episode_title       | no          |                            | If the content_type is "podcast" and a title is provided to this attribute, then the title will be included in the boost metadata.                                                                                                                                                                                                                                                                 |
| podcast_podcast_index_id    | no          |                            | If the content_type is "podcast", and a Podcast Index podcast id is provided, then the id will be included in the boost metadata.                                                                                                                                                                                                                                                                  |
| podcast_title               | no          |                            | If the content_type is "podcast" and a title is provided to this attribute, then the title will be included in the boost metadata.                                                                                                                                                                                                                                                                 |
| recipient_label             | no          | Content Creator            | The label for the "Content Creator" input. If the content_type is "podcast", the label will default to "Podcaster".                                                                                                                                                                                                                                                                                |
| recipient_value_default     | no          | 0                          | The default value for the "Content Creator" input.                                                                                                                                                                                                                                                                                                                                                 |
| send_button_label           | no          | Send Boost                 | The text for the "Send Boost" button.                                                                                                                                                                                                                                                                                                                                                              |
| send_button_sent_label      | no          | Boost Sent!                | The text that appears in the "Send Boost" button after a boost has been sent.                                                                                                                                                                                                                                                                                                                      |
| sender_name                 | no          |                            | The name of the person sending the boost.                                                                                                                                                                                                                                                                                                                                                          |
| sender_name_label           | no          | Your Name                  | The label for the "Your Name" input.                                                                                                                                                                                                                                                                                                                                                               |
| v4v_tag                     | yes         |                            | The `<podcast:value>` object that must be passed in to specify which content creators should receive the boost, and what the splits should be. See "Add the webcomponent" section above for an example. To learn more about `<podcast:value>` for the `v4v_tag` attribute, visit the [documentation for the spec](https://github.com/Podcastindex-org/podcast-namespace/blob/main/value/value.md). |

## Customize the webcomponent styles (optional)

You can override some of the styles of the webln-v4v form by setting CSS variables.

A full list of the customizable CSS variables can be [found here](https://github.com/podverse/webln-v4v/blob/main/app/styles/sample-variable-overrides.scss). The sample is designed to match the look and feel of the [Podverse website](https://podverse.fm).

## Handle the webcomponent events (optional)

The webcomponent fires some events that your webpage can listen for to remember information the user has entered previously in the form.

| Event                        | Definition                                                                                                                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WebLN-V4V-Has-Loaded         | This fires after the form has finished initializing. Use this to hide a loading spinner after the form initially renders.                                                                                                                                              |
| WebLN-V4V-Terms-Accepted     | This fires when the user presses the "Accept Terms" button. You can use this to set a cookie that remembers the user has already accepted the terms, then pass in "true" to the `has_accepted_terms` attribute to skip the "Accept Terms" screen on subsequent visits. |
| WebLN-V4V-Terms-Rejected     | This fires when the user presses the "Cancel" button. You can use this to set a cookie that remembers the user has already rejected the terms, then pass in "true" to the `has_rejected_terms` attribute to hide the "Accept Terms" screen on subsequent visits.       |
| WebLN-V4V-New-Default-Values | This fires whenever the user changes the "Content Creator" value, "App" value, or "Your Name" value. The new values will be available in the `detail` property on the event.                                                                                           |

## Advanced Example

For a more advanced example of a webln-v4v implementation, check out the WebLNV4VForm in the [podverse-web repo](https://github.com/podverse/podverse-web/blob/develop/src/components/WebLNV4VForm/WebLNV4VForm.tsx).

## Questions? Contributions?

If you'd like report a bug or make a code contribution, please create a Github issue in this repo and/or a Pull Request.

For other questions, please visit the [Podverse Contact](https://podverse.fm/contact) page for ways you can reach us. Thank you!
