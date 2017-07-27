'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');

const nodeDir = require('node-dir');
const sass = require('node-sass');
const _ = require('lodash');

const utils = require('../utils');
const fsx = utils.fsx;

module.exports = class ThemeBuilder {
    constructor(themeRootDir, outputDir, options) {
        this.currentDir = process.cwd();

        this.themeRootDir = themeRootDir;
        this.outputDir = outputDir;

        this.options = options || {};
        this.options.flattenOutput = this.options.flattenOutput || false;
        this.options.recreateOutputDir = this.options.recreateOutputDir == undefined ? true : false;
        this.options.themesToBuild = [].concat(this.options.themesToBuild || []);

        if (this.options.flattenOutput && this.options.themesToBuild.length !== 1) {
            throw `To flatten the theme output, specify a single theme to process.`;
        }
    }

    build() {
        this.prepareOutputDirectory();

        //Get all directories under the themes root folder that do not start with a '_'.
        let themes = nodeDir.files(this.themeRootDir, 'dir', null, {
            sync: true,
            shortName: true,
            recursive: false
        }).filter(t => !_.startsWith(t, '_'));

        let rootStyleFile = utils.makeRelativePath(this.currentDir, path.resolve(this.themeRootDir, 'index.scss'));
        let themesToBuild = [].concat(this.options.themesToBuild);
        for (let i = 0; i < themes.length; i++) {
            let theme = themes[i];
            if (themesToBuild.length > 0 && !themesToBuild.some(thm => thm === theme)) {
                continue;
            }

            let outputDir = this.options.flattenOutput ? this.outputDir : path.resolve(this.outputDir, theme);
            let cssDir = path.resolve(outputDir, 'css');
            fsx.mkdir.sync(cssDir);

            let themeDir = path.resolve(this.themeRootDir, theme);
            let themeStyleFile = utils.makeRelativePath(this.currentDir, path.resolve(themeDir, 'index.scss'));
            let scss = [
                `@import "${rootStyleFile}";`,
                `@import "${themeStyleFile}";`
            ].join(os.EOL);

            let cssFile = path.resolve(cssDir, 'styles.css');
            let result = sass.renderSync({
                data: scss,
                outFile: cssFile
            });
            fs.writeFileSync(cssFile, result.css, 'utf8');

            this.copyAssets(this.themeRootDir, outputDir, cssDir);
            this.copyAssets(themeDir, outputDir, cssDir);
        }
    }

    /**
     * If the output directory exists, delete it and recreate it.
     */
    prepareOutputDirectory() {
        if (fs.existsSync(this.outputDir) && this.options.recreateOutputDir) {
            fsx.rmdir.sync(this.outputDir, { force: true });
        }
        if (!fs.existsSync(this.outputDir)) {
            fsx.mkdir.sync(this.outputDir);
        }
    }

    copyAssets(assetsDir, outputDir, cssDir) {
        let assetsFile = path.resolve(assetsDir, 'assets.json');
        if (!fs.existsSync(assetsFile)) {
            return;
        }

        let assets = require(assetsFile);
        if (assets instanceof Array) {
            this.copySpecificAssets(assets, cssDir);
        } else {
            if (assets.css && assets.css instanceof Array) {
                this.copySpecificAssets(assets.css, cssDir);
            }
            if (assets.others && assets.others instanceof Array) {
                this.copySpecificAssets(assets.others, outputDir);
            }
        }
    }

    copySpecificAssets(assets, outputDir) {
        for (let i = 0; i < (assets || []).length; i++) {
            let asset = assets[i];
            let srcGlob = path.resolve(this.currentDir, asset.src);
            let destDir = path.resolve(outputDir, asset.dest);
            if (!fs.existsSync(destDir)) {
                fsx.mkdir.sync(destDir);
            }
            fsx.copy(srcGlob, destDir, function(err, files) {
                if (err) {
                    throw err;
                }
            });
        }
    }
}
