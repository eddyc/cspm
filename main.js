#! /usr/bin/env node

(function main() {

    if (process.argv.length < 3) {

        console.log("cspm: Error, not enough arguments.");
        console.log("Usage:");
        console.log("cspm install user/repo/version");
        console.log("Or for the latest version:");
        console.log("cspm install user/repo");
        process.exit();
    }

    let option = process.argv[2];
    let isWin = /^win/.test(process.platform);
    const path = require("path");

    switch (option) {

        case "install": {

            let installPath = path.join(__dirname, "install");
            let install = require(installPath).install;
            let result = install(process.argv);
            return result;
            break;
        }
        case "init": {

            let initPath = path.join(__dirname, "init");
            let init = require(initPath).init;
            let type = process.argv[3];

            if (process.argv.length === 3) {

                console.log("Error: please specify init type, udo, csd etc..");
                process.exit();
            }
            else if (process.argv.length === 4) {

                init(type);
            }
            break;
        }
        case "link": {

            if (isWin === true) {

                console.log("Error: link not supported on windows, exiting");
                process.exit(-1);
            }

            if (process.argv.length === 4) {

                let linkPath = path.join(__dirname, "link");
                let link = require(linkPath);
                let packageName = process.argv[3];
                link(packageName);
            }
            else {

                console.log("Error: incorrect number of arguments, exiting...");
                process.exit();
            }

            break;
        }
        case "run": {

            if (isWin === true) {

                console.log("Error: link not supported on windows, exiting");
                process.exit(-1);
            }

            let runPath = path.join(__dirname, "run");

            let run = require(runPath);
            let packageName = process.argv[3];
            run(packageName, process.argv);
            break;
        }

        case "build": {

            if (process.argv.length === 4) {

                let buildPath = path.join(__dirname, "build");
                let build = require(buildPath);
                let buildType = process.argv[3];
                build(buildType);
            }
            else {

                console.log("Error: no build type specified");
            }
            break;

        }
        default: {

            console.log("Usage:");
            console.log("cspm install user/repo/version");
        }
    }
})();
