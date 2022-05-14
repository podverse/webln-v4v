/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Add license on bundle
 * =====================
 *
 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
 *
 * @license: MIT License
 *
 */
import * as fs from "fs";
const pkg = require("../package.json");

declare const __dirname: string;

const license = `// WebComponent: ${pkg.displayName} v${pkg.version}
// Author: ${pkg.author}
// License: ${pkg.license}
// ${pkg.homepage}
`;

const js = fs.readFileSync(`${__dirname}/../dist/webcomponent.js`).toString();
fs.unlinkSync(`${__dirname}/../dist/webcomponent.js`);
fs.writeFileSync(`${__dirname}/../dist/webcomponent.js`, `${license}${js}`, { encoding: "utf8" });
