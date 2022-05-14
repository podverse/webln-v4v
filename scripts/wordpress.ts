/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Wordpress Package
 * =====================
 *
 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
 *
 * @license: MIT License
 *
 */
import * as fs from "fs";
import * as shell from "shelljs";
import nunjucks from "nunjucks";
const pkg = require("../package.json");

declare const __dirname: string;

nunjucks.configure({
	autoescape: false,
});

let html = nunjucks.render(`${__dirname}/../wordpress/readme.txt`, { package: pkg });
fs.writeFileSync(`${__dirname}/../dist/readme.txt`, html, "utf8");

html = nunjucks.render(`${__dirname}/../wordpress/lnurl_widget.php`, { package: pkg });
fs.writeFileSync(`${__dirname}/../dist/lnurl_widget.php`, html, "utf8");

shell.mkdir("-p", `${__dirname}/../build/${pkg.name.replace("@podverse/", "")}/`);
shell.mkdir("-p", `${__dirname}/../dist/wordpress/`);
shell.cp("-R", `${__dirname}/../dist/*`, `${__dirname}/../build/${pkg.name.replace("@podverse/", "")}/`);

shell.rm("-r", `${__dirname}/../build/${pkg.name.replace("@podverse/", "")}/wordpress`);
shell.exec(`cd build && zip -r ../dist/wordpress/${pkg.name.replace("@podverse/", "")}-wordpress-plugin.zip .`);

shell.rm("-r", `${__dirname}/../build`);
shell.rm("-r", `${__dirname}/../dist/lnurl_widget.php`);
shell.rm("-r", `${__dirname}/../dist/readme.txt`);
