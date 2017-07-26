'use strict';

const utils = require('../../utils');

module.exports = function() {
    console.log(`Watches the specific theme directory for changes, and builds and deploys any changes immediately.`);
    console.log();
    utils.help.usage(`web-themer watch <options>`);
    console.log();
    utils.help.option('directory', 'dir', 'String', './themes', false,
        `Root directory for the themes.`);
    utils.help.option('output', 'out', 'String', './output',
        `Copies the generated output to the specified folder.`);
    utils.help.option('theme', 't', 'String', undefined, true,
        `Theme to watch`);
    utils.help.option('production', 'prod', 'Boolean', 'false', false,
        `Optimizes the output CSS for production.`);
};
