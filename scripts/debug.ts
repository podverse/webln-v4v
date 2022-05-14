/**
 * Disable debug
 * =====================
 * Check if configs/config.js has debug to off
 *
 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
 *
 * @license: MIT License
 *
 */
import * as fs from "fs";
import * as shell from "shelljs";
import { argv } from "yargs";

declare const __dirname: string;

const path = `${__dirname}/../app/configs/config.js`;

if (fs.existsSync(path)) {
	if (argv.enable) {
		shell.sed("-i", 'debug: "disabled"', 'debug: "enabled"', path);
	} else {
		shell.sed("-i", 'debug: "enabled"', 'debug: "disabled"', path);
	}
}
