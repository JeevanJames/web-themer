'use strict';

const utils = require('../../utils');

const validators = {
    directory: {},
    output: {},
    theme: {},
    production: {}
};

module.exports = function(argv) {
    utils.validateArgs(argv, 0, 0, validators);
}
