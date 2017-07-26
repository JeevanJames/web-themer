'use strict';

const utils = require('../../utils');

function processArgs(argv) {
    utils.validateArgs(argv, 0, 1, {});
}

module.exports = {
    run: require('./run'),
    processArgs
};
