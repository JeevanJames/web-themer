'use strict';

const chalk = require('chalk');

const utils = require('../../utils');

module.exports = function() {
    console.log(`Builds the themes into the default output location.`);
    console.log();
    utils.help.usage(`web-themer build <options>`);
    console.log();
    utils.help.option('production', 'Boolean', 'false', `Optimizes the output CSS for production.`, ['-prod']);
};
