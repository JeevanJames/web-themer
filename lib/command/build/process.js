'use strict';

const utils = require('../../utils');

const validators = {
    production: {},
    verbose: {}
};

module.exports = function(argv) {
    utils.validateArgs(argv, 0, 0, validators);
}