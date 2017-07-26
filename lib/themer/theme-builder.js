'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');

const nodeDir = require('node-dir');
const sass = require('node-sass');

const utils = require('../utils');
const fsx = utils.fsx;

module.exports = class ThemeBuilder {
    constructor(themeRootDir, outputDir, themesToBuild) {
        this.currentDir = process.cwd();
        this.themeRootDir = themeRootDir;
        this.outputDir = outputDir;
        this.themesToBuild = themesToBuild;
    }

    build() {
        this.prepareOutputDirectory();

        let themes = nodeDir.files(this.themeRootDir, 'dir', null, {
            sync: true,
            shortName: true,
            recursive: false
        });

        let rootStyleFile = utils.makeRelativePath(this.currentDir, path.resolve(this.themeRootDir, 'index.scss'));
        for (let i = 0; i < themes.length; i++) {
            let theme = themes[i];
            if (this.themesToBuild && this.themesToBuild.length > 0 && !this.themesToBuild.some(t => t === theme)) {
                continue;
            }

            let outputDir = path.resolve(this.outputDir, theme);
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
        }
    }

    prepareOutputDirectory() {
        if (fs.existsSync(this.outputDir)) {
            fsx.rmdir.sync(this.outputDir);
        }
        fsx.mkdir.sync(this.outputDir);
    }


}
