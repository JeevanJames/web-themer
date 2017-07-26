'use strict';

const chalk = require('chalk');

function usage(usage) {
    console.log('Usage: ' + chalk.cyan(usage));
}

function option(long, type, defaultValue, description, aliases) {
    console.log(chalk.cyan(`--${long} (${type}) (Default: ${defaultValue}) `) + description);
    console.log(chalk.gray(`  aliases: ${[].concat(aliases).join(', ')}`));
}

module.exports = {
    usage,
    option
};
