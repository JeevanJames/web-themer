'use strict';

const path = require('path');
const process = require('process');

const ThemeBuilder = require('../../themer/theme-builder');

module.exports = function(argv) {
    const currentDir = process.cwd();

    let themeRootDir = path.resolve(currentDir, argv.directory || './themes');
    let outputDir = path.resolve(currentDir, argv.output || './output');
    let builder = new ThemeBuilder(themeRootDir, outputDir, {
        themesToBuild: argv.theme
    });
    builder.build();
};
