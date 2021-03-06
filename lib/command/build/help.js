'use strict';

const utils = require('../../utils');

module.exports = function() {
    console.log(`Builds all the themes and copies`);
    console.log();
    utils.help.usage(`web-themer build <options>`);
    console.log();
    utils.help.option('directory', 'dir', 'String', './themes', false,
        `Root directory for the themes.`);
    utils.help.option('output', 'out', 'String', './output',
        `Copies the generated output to the specified folder.`);
    utils.help.option('theme', 't', 'String', '<all themes>', false,
        `Theme to build. If omitted, all themes are built.`);
    utils.help.option('production', 'prod', 'Boolean', 'false', false,
        `Optimizes the output for production.`);
};
