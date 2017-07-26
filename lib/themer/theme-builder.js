'use strict';

const fs = require('fs');
const os = require('os');
const process = require('process');

const nodeDir = require('node-dir');
const sass = require('node-sass');

const fsx = require('../utils').fsx;

module.exports = class ThemeBuilder {
    constructor(themeRootDir, outputDir) {
        this.themeRootDir = themeRootDir;
        this.outputDir = outputDir;
    }

    build() {
        this.prepareOutputDirectory();

        let themes = nodeDir.files(this.themeRootDir, 'dir', null, {
            sync: true,
            shortName: true,
            recursive: false
        });

        let rootStyleFile = path.resolve(this.themeRootDir, 'index.scss');
        for (let i = 0; i < themes.length; i++) {
            let theme = themes[i];

            let outputDir = path.resolve(this.outputDir, theme);
            let cssDir = path.resolve(outputDir, 'css');
            fsx.mkdir(cssDir);

            let themeDir = path.resolve(this.themeRootDir, theme);
            let themeStyleFile = path.resolve(themeDir, 'index.scss');
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
