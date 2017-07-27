'use strict';

const utils = require('../../utils');

const validators = {
    directory: {},
    output: {},
    theme: {},
    'recreate-output-dir': {},
    production: {}
};

module.exports = function(argv) {
    utils.validateArgs(argv, 0, 0, validators);
}
