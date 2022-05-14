/**
 * Node Module (Library) Boilerplate
 * =====================
 *
 * Create your node module (library) with this user friendly boilerplate. Use this respository as template for your new node library/module
 *
 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
 *
 * @license: MIT License
 *
 */

/**
 * ModuleInterface
 * =====================
 *
 */
export interface ModuleInterface {
	/**
	 * Render LNURL widget
	 * =====================
	 *
	 * @interface [ModuleInterface](https://github.com/podverse/lnurl-widget/blob/main/app/webcomponent/types/module.interfaces.ts)
	 *
	 * @param {string} app_name - the name of the app that is using the window.lnurl object
	 * @param {string} message - text to send along with the boost. Also known as a "Boostagram".
	 * @param {string} name - ???
	 * @param {string} sender_name - ???
	 * @param {number} value_msat_total - total number of sats to send
	 *
	 */
	app_name: string;
	message?: string;
	name: string;
	sender_name: string;
	value_msat_total: number;
}

/**
 * ModuleResponseInterface
 * =====================
 *
 */
export interface ModuleResponseInterface {
	/**
	 *
	 * @interface [ModuleResponseInterface](https://github.com/podverse/lnurl-widget/blob/main/app/webcomponent/types/module.interfaces.ts)
	 *
	 * @return {fn}
	 *
	 */
	app(): string;
}
