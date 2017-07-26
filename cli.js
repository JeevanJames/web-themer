#!/usr/bin/env node

'use strict';

const process = require('process');

const chalk = require('chalk');
const minimist = require('minimist');
const _ = require('lodash');

const helpCommand = require(`./lib/command/help`);

function displayHelp(command) {
    helpCommand.run({ '_': command ? [command] : [] });
}

let allArgs = process.argv;

//Check if we are executed using Node.exe
//Only on Windows and needed for my debugging purposes.
let runningFromNode = _.endsWith(allArgs[0].toLowerCase(), 'node.exe');

//Verify the number of args passed. There should be at least a command specified.
let argsCount = runningFromNode ? allArgs.length - 3 : allArgs.length - 2;
if (argsCount < 0) {
    displayHelp();
    return -1;
}

//Process the args after the command.
let argv = minimist(allArgs.slice(runningFromNode ? 3 : 2));

//Try to load the command module.
let command = runningFromNode ? allArgs[2] : allArgs[1];
let commandModule;
try {
    commandModule = require(`./lib/command/${command}`);
} catch (ex) {
    console.log(chalk.red(`Unrecognized command: '${command}'.`));
    if (argv.verbose) {
        console.log(chalk.white.bgRed(ex));
    }
    displayHelp();
    return -1;
}

//Command-specific validation of the args
if (commandModule.processArgs) {
    try {
        commandModule.processArgs(argv);
    } catch (err) {
        console.log(chalk.red(err));
        displayHelp(command);
    }
}

//Execute the module
commandModule.run(argv);
