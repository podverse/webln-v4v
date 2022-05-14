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
	 * Input text
	 * =====================
	 * Set text
	 *
	 * @interface [ModuleInterface](https://github.com/podverse/lnurl-widget/blob/main/app/webcomponent/types/module.interfaces.ts)
	 *
	 * @param {string} text - input text
	 *
	 */
	text: string;
}

/**
 * ModuleResponseInterface
 * =====================
 *
 */
export interface ModuleResponseInterface {
	/**
	 * Output text
	 * =====================
	 * Get text
	 *
	 * @interface [ModuleResponseInterface](https://github.com/podverse/lnurl-widget/blob/main/app/webcomponent/types/module.interfaces.ts)
	 *
	 * @return {fn} string - run app() for output text
	 *
	 */
	app(): string;
}
