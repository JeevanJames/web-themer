'use strict';

const chalk = require('chalk');

const utils = require('../../utils');

function displayGeneralHelp() {
    utils.help.usage(`web-themer <command> [<options>...]`);
    console.log();
    console.log(`Commands:`);
    console.log(chalk.cyan(`    build, watch`));
    console.log();
    console.log(chalk.cyan(`web-themer help <command>`) + `   Get detailed help for <command>`);
    console.log(chalk.cyan(`web-themer version`) + `          Print the CLI version`)
}

function displayCommandHelp(command) {
    let helpModule;
    try {
        helpModule = require(`../${command}/help`);
    } catch (ex) {
        console.error(chalk.red(`Invalid command '${command}'.`));
        console.log();
        displayGeneralHelp();
        return;
    }

    helpModule();
    utils.help.option('verbose', 'Boolean', 'false', `Adds more details to the output.`, ['-v']);
    utils.help.option('debug', 'Boolean', 'false', `Adds technical details to the output to aid with debugging.`, ['-d']);
}

module.exports = function(argv) {
    console.log();

    if (argv._.length > 0) {
        displayCommandHelp(argv._[0]);
    } else {
        displayGeneralHelp();
    }

    console.log();
}
