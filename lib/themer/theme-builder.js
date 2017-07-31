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

        let rootSassContent = fs.readFileSync(path.resolve(this.themeRootDir, 'index.scss'), 'utf8');
        let themesToBuild = [].concat(this.options.themesToBuild);
        for (let i = 0; i < themes.length; i++) {
            let theme = themes[i];

            //If only specific themes need to be built, check if this theme is in the list
            if (themesToBuild.length > 0 && !themesToBuild.some(thm => thm === theme)) {
                continue;
            }

            //Get the output root directory and the CSS output directory
            //Create these directories, if they do not exist
            let outputDir = this.options.flattenOutput ? this.outputDir : path.resolve(this.outputDir, theme);
            let cssDir = path.resolve(outputDir, 'css');
            fsx.mkdir.sync(cssDir);

            //Get the name of the output CSS file
            let cssFile = path.resolve(cssDir, 'styles.css');

            //Get the SASS to compile by replacing any occurence of <%theme%> with the theme name
            //in the root SASS file content.
            let sassContent = rootSassContent.replace(/<%theme%>/g, theme);

            //Compile the SASS and write to the output CSS file
            let result = sass.renderSync({
                data: sassContent,
                outFile: cssFile,
                includePaths: [utils.makeRelativePath(this.currentDir, this.themeRootDir)]
            });
            fs.writeFileSync(cssFile, result.css, 'utf8');

            //Copy assets mentioned in the assets.json in the root directory
            this.copyAssets(this.themeRootDir, outputDir, cssDir);

            //Copy assets mentioned in the assets.json in the theme directory
            let themeDir = path.resolve(this.themeRootDir, theme);
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
            this.copySpecificAssets(assets, assetsDir, cssDir);
        } else {
            if (assets.css && assets.css instanceof Array) {
                this.copySpecificAssets(assets.css, assetsDir, cssDir);
            }
            if (assets.others && assets.others instanceof Array) {
                this.copySpecificAssets(assets.others, assetsDir, outputDir);
            }
        }
    }

    copySpecificAssets(assets, srcDir, outputDir) {
        for (let i = 0; i < (assets || []).length; i++) {
            let asset = assets[i];
            let srcGlob = path.resolve(srcDir, asset.src);
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
