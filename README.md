# 🏗 lnurl-widget

<!-- all-shields/header-badges:START -->

[![v1.0.0-beta.4](https://img.shields.io/badge/version-v1.0.0--beta.4-lightgray.svg?style=flat&logo=)](https://github.com/podverse/lnurl-widget/blob/main/CHANGELOG.md) [![](https://img.shields.io/npm/v/lnurl-widget?color=CC3534&logo=npm)](https://www.npmjs.com/package/lnurl-widget) [![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat&logo=license)](https://github.com/podverse/lnurl-widget/blob/main/LICENSE.md) [![Powered By Svelte](https://img.shields.io/badge/powered%20by-svelte-FF3C02.svg?style=flat&logo=svelte)](https://svelte.dev/) [![Language: TypeScript](https://img.shields.io/badge/language-typescript-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/) [![ECMAScript: 2019](https://img.shields.io/badge/ES-9-F7DF1E.svg?style=flat&logo=javascript)](https://github.com/tc39/ecma262) [![Discord Server](https://discordapp.com/api/guilds/383373985666301975/embed.png)](https://discord.ptkdev.io)

<!-- all-shields/header-badges:END -->

A library for rendering a UI widget for sending Bitcoin Lightning payments with an LNURL compatible browser extension.

## DISCLAIMER 🚨🚨🚨

This is an experimental library. The software is provided AS-IS, we make no guarantees of its reliability, we are not responsible if your funds go missing or are sent to the wrong address, and you and your users assume all risks associated with using it.

## Supported Browser Extensions

This widget will only render on a web page if it detects that the user has an [LNURL](https://github.com/fiatjaf/lnurl-rfc) compatible browser extension installed.

Currently supported browser extensions include:

[Alby](https://github.com/getAlby/lightning-browser-extension)

## Attribution / Donate to Patrick

Thank you to [@ptkdev](https://github.com/ptkdev) for creating the [svelte-webcomponent-boilerplate](https://github.com/ptkdev-boilerplate/svelte-webcomponent-boilerplate). This project was built on top of this boilerplate. Please consider [donating to Patrick](https://github.com/ptkdev) for his great work.

## Support Podverse

> Podverse is **free** / **open source** / **copylefted libre** software, and we would greatly appreciate your donations or pull requests 🙏

<!-- all-shields/sponsors-badges:START -->

[![Donate Paypal](https://img.shields.io/badge/donate-paypal-005EA6.svg?style=for-the-badge&logo=paypal)](https://www.paypal.com/donate?hosted_button_id=YKMNUDUCRTUPC) [![Donate Patreon](https://img.shields.io/badge/donate-patreon-F87668.svg?style=for-the-badge&logo=patreon)](https://www.patreon.com/podverse) [![Donate Bitcoin](https://img.shields.io/badge/BTC-bc1qqme0tj5gutgujsz62xqcfc6emfgm5wky27zc30-E38B29.svg?style=flat-square&logo=bitcoin)](https://ptk.dev/img/icons/menu/bitcoin_wallet.png)

<!-- all-shields/sponsors-badges:END -->

## 📎 Menu

-   💡 [Features](#-features)
-   🕹 Demo - TODO: coming soon
-   👔 Screenshot - TODO: coming soon
-   🚀 [How to use](#-installation)
-   -   🌎 [Web](#-installation-web)
-   -   📦 [Webpack/Browserify](#-installation-npm-module---browserifywebpack)
-   -   📖 [Wordpress](#-installation-wordpress)
-   -   🔵 [React](#-installation-react)
-   -   🔴 [Angular](#-installation-angular)
-   -   🟠 [Svelte](#-installation-svelte)
-   -   🟢 [Vue](#-installation-vue)
-   📚 [Documentation](#-documentation)
-   -   🧰 [Options / Attributes](#-options--attributes)
-   -   🎨 [CSS Customization](#-css-customization)
-   🔨 [Developer Mode](#-developer-mode)
-   -   🏁 [Run Project](#-run-project)
-   -   💾 [Setup Project](#-setup-project)
-   🐛 [Known Bugs](https://github.com/podverse/lnurl-widget/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
-   🍻 Community:
-   <img src="https://raw.githubusercontent.com/podverse/lnurl-widget/main/.github/assets/social_discord.png" height="18px"> [Discord](https://discord.com/invite/6HkyNKR))
-   <img src="https://raw.githubusercontent.com/podverse/lnurl-widget/main/.github/assets/social_twitter.png" height="18px"> [Twitter](http://twitter.com/podverse)

## 💡 Features

-   [✔️] Easy to use
-   [✔️] MIT License
-   [✔️] Text animation by [Nooray Yemon](https://codepen.io/yemon) on [Codepen](https://codepen.io/yemon/pen/pWoROm)
-   [✔️] Friendly boilerplate + Github templates
-   [✔️] Powered by svelte framework
-   [✔️] Without jQuery depencence
-   [✔️] Configurable with attributes
-   [✔️] Customization with CSS Style
-   [✔️] HTML5 Custom Elements - Native webcomponents
-   [✔️] Work with: Browserify / Webpack / ReactJS / Svelte / Angular / Vue / Wordpress
-   [✔️] Typescript + TSPaths preconfigured
-   [✔️] Userfriendly folders tree
-   [✔️] Prettiers and ESLint preconfigured
-   [✔️] all-contributors-cli and all-shields-cli preconfigured
-   [✔️] JEST Test preconfigured
-   [✔️] Full async code
-   [✔️] Github and Vscode dotfiles preconfigured
-   [✔️] Translations i18n (Help me ❤️)

## 🚀 Installation (Web)

1. Add html code to your page:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

2. Require javascript in yourpage (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/lnurl-widget@latest/dist/webcomponent.js"></script>
```

You can replace `@latest` with specific version, example `@2.0.1`.

Below is available a description of `options` values.

## 📦 Installation (NPM Module - Browserify/Webpack)

1. Install npm module: `npm install lnurl-widget --save`
2. Add html code to your page:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

3. Require javascript in your app:

```javascript
require("lnurl-widget");
```

or

```javascript
import "lnurl-widget";
```

Below is available a description of `options` values.

## 📖 Installation (Wordpress)

1. Download wordpress plugin from [mirror](https://cdn.jsdelivr.net/npm/lnurl-widget@latest/dist/wordpress/lnurl-widget-wordpress-plugin.zip) and install it.
1. Add code to your html widget, example: `Appearance` --> `Widget` --> insert `HTML Widget` and paste html code:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

You can insert this html code in posts, widget, html box or theme.

## 🔵 Installation (React)

1. Install npm module with `npm install lnurl-widget@latest --save`:
2. Import module in your `src/App.js` on header:

```javascript
import "lnurl-widget";
```

3. Add html code to your `App.js` template:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

## 🔴 Installation (Angular)

1. Install npm module with `npm install lnurl-widget@latest --save`:
2. Import module in your `app/app.modules.ts` on header:

```javascript
import "lnurl-widget";
```

3. Add html code to your html component:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

## 🟠 Installation (Svelte)

1. Install npm module with `npm install lnurl-widget@latest --save`:
2. Import module in your `src/App.svelte` on header:

```javascript
import "lnurl-widget";
```

3. Add html code to your html component:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

## 🟢 Installation (Vue)

1. Install npm module with `npm install lnurl-widget@latest --save`:
2. Import module in your `src/App.vue` and add webcomponent to ignoreElements of vue config:

```javascript
import Vue from "vue";
import "lnurl-widget";

Vue.config.ignoredElements = ["lnurl-widget"];
```

3. Add html code to your html component:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

## 🧰 Options / Attributes

| Parameter | Description                                  | Values             | Default value                     | Available since |
| --------- | -------------------------------------------- | ------------------ | --------------------------------- | --------------- |
| header    | Setup top text                               | String             | `make`                            | v1.0.20210319   |
| flip      | Setup middle flip text (separte with commas) | String with commas | `svelte,webcomponents,opensource` | v1.0.20210319   |
| footer    | Setup bottom text                            | String             | `awesome!`                        | v1.0.20210319   |

#### HTML Code with attributes:

```html
<lnurl-widget header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></lnurl-widget>
```

## 🎨 CSS Customization

You can overwrite default css with selector `::part`, example:

```html
<style>
	lnurl-widget::part(flip) {
		border: 2px solid red;
	}
</style>
```

Part attribute is, generally, suffix of a class. Use chrome inspector for get the correct value of `part=""` attributes. See [MDN selector ::part docs](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).

## 🔨 Developer Mode

#### 🏁 Run Project

1. Clone this repository or download [nightly](https://github.com/podverse/lnurl-widget/archive/nightly.zip), [beta](https://github.com/podverse/lnurl-widget/archive/beta.zip) or [stable](https://github.com/podverse/lnurl-widget/archive/main.zip).
2. Run `npm install`
3. Run `npm run dev`
4. Run `http://localhost:5000`

#### 💾 Setup Project

If you want replace all strings (example: package name, author, urls, etc...) in markdown file, source files and others files of this project you need edit `setup.json` with correct values and run `npm run setup`.

## 📚 Documentation

Run `npm run docs`

## 💫 License

-   Code and Contributions have **MIT License**
-   Images and logos have **CC BY-NC 4.0 License**
-   Documentations and Translations have **CC BY 4.0 License**

###### Copyleft (c) 2021 [Mitch Downey](https://github.com/mitchdowney) ([@Podverse](https://twitter.com/podverse))
