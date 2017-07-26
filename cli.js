#!/usr/bin/env node

'use strict';

const process = require('process');

const chalk = require('chalk');
const minimist = require('minimist');
const _ = require('lodash');

const helpCommand = require(`./lib/command/help`);

function displayHelp() {
    helpCommand.run({ '_': [] });
}

let allArgs = process.argv;
let runningFromNode = _.endsWith(allArgs[0].toLowerCase(), 'node.exe');

let argsCount = runningFromNode ? allArgs.length - 3 : allArgs.length - 2;
if (argsCount < 0) {
    displayHelp();
    return -1;
}

let argv = minimist(allArgs.slice(runningFromNode ? 3 : 2));

let command = runningFromNode ? allArgs[2] : allArgs[1];
let commandModule;
try {
    commandModule = require(`./lib/command/${command}`);
} catch (ex) {
    console.log(chalk.red(`Invalid command: '${command}'.`));
    if (argv.verbose) {
        console.log(chalk.white.bgRed(ex));
    }
    displayHelp();
    return -1;
}

if (commandModule.processArgs) {
    try {
        commandModule.processArgs(argv);
    } catch (err) {
        console.log(chalk.red(err));
        helpCommand.run({ '_': [command] });
    }
}

commandModule.run(argv);
