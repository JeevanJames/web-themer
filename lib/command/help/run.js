'use strict';

const chalk = require('chalk');

function displayGeneralHelp() {
    console.log(`Usage: ` + chalk.blue(`web-themer <command> [<options>...]`));
    console.log();
    console.log(`Commands:`);
    console.log(chalk.blue(`    build, deploy, watch`));
    console.log();
    console.log(chalk.blue(`web-themer help <command>`) + `   Get detailed help for <command>`);
    console.log(chalk.blue(`web-themer version`) + `          Print the CLI version`)
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

    let helpText = typeof helpModule === 'function' ? helpModule() : helpModule;
    (helpText || []).forEach(h => console.log(h));
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
