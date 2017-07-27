'use strict';

const path = require('path');
const process = require('process');

const chalk = require('chalk');
const chokidar = require('chokidar');

const ThemeBuilder = require('../../themer/theme-builder');
const utils = require('../../utils');

function onReady() {
    console.log(chalk.yellow(`Watching files. Press Ctrl+C to stop.`))
}

function onError(error) {
    console.log(chalk.white.bgRed(`[Error] `) + chalk.red(error));
}

function onTrigger(action, path, builder) {
    console.log(chalk.yellow(`[${action}] `) + chalk.cyan(path));
    builder.build();
}

module.exports = function(argv) {
    const currentDir = process.cwd();

    let theme = argv.theme;

    let themeRootDir = path.resolve(currentDir, argv.directory || './themes');
    let outputDir = path.resolve(currentDir, argv.output || './output');
    let builder = new ThemeBuilder(themeRootDir, outputDir, {
        flattenOutput: true,
        themesToBuild: theme,
        recreateOutputDir: argv['recreate-output-dir'] || false
    });
    builder.build();

    let rootWatchDir = utils.makeRelativePath(currentDir, themeRootDir);
    let watcher = chokidar.watch([`${rootWatchDir}/*`, `${rootWatchDir}/${theme}/**/*`], {
        ignoreInitial: true,
        awaitWriteFinish: true
    });
    watcher
        .on('ready', onReady)
        .on('error', onError)
        .on('add', path => onTrigger('Add', path, builder))
        .on('change', path => onTrigger('Change', path, builder))
        .on('addDir', path => onTrigger('AddDir', path, builder))

    //Handle ctrl+c
    //https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
    if (process.platform === "win32") {
        var rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
    }

    process.on("SIGINT", function () {
        //graceful shutdown
        watcher.close();
        console.log(chalk.yellow('Watching completed.'));
        process.exit();
    });
};
