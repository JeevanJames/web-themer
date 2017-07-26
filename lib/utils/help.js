'use strict';

const chalk = require('chalk');

function usage(usage) {
    console.log('Usage: ' + chalk.cyan(usage));
}

function option(name, alias, type, defaultValue, required, description) {
    console.log(chalk.cyan(`--${name} (${type}) ${required ? '' : '(optional)'} `) + description);
    if (defaultValue) {
        console.log(chalk.gray(`  default: ${defaultValue}`));
    }
    console.log(chalk.gray(`  alias: -${alias}`));
}

module.exports = {
    usage,
    option
};
