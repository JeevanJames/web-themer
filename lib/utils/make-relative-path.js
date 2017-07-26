'use strict';

const path = require('path');

module.exports = function(from, to) {
    let relativePath = path.relative(from, to).replace(/\\/g, '/');
    if (relativePath && relativePath[0] !== '.') {
        relativePath = './' + relativePath;
    }
    return relativePath;
}
