'use strict';

const path = require('path');
const process = require('process');

const ThemeBuilder = require('../../themer/theme-builder');

module.exports = function(argv) {
    const currentDir = process.cwd();

    let themeRootDir = path.resolve(currentDir, 'themes');
    let outputDir = path.resolve(currentDir, 'output');
    let builder = new ThemeBuilder(themeRootDir, outputDir);
    builder.build();
};
