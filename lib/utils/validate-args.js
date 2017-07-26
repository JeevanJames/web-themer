'use strict';

module.exports = function(argv, minParams, maxParams, validators) {
    if (argv._.length < minParams) {
        throw `Not enough parameters passed.`;
    }
    if (argv._.length > maxParams) {
        throw `Too many parameters passed.`;
    }

    if (!validators.verbose) {
        validators.verbose = {};
    }
    for (let key in argv) {
        if (key === '_') {
            continue;
        }
        if (!validators[key]) {
            throw `Unrecognized option '${key}'.`;
        }
    }
}