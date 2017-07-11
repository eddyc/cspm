#! /usr/bin/env node

(function main() {

    if (process.argv.length < 3) {

        console.log("cspm: Error, not enough arguments.");
        process.exit();
    }

    let option = process.argv[2];
    let isWin = /^win/.test(process.platform);

    switch (option) {

        case "install": {


            let install = require("./install").install;
            let result = install(process.argv);
            return result;
            break;
        }
        case "init": {

            let init = require('./init').init;
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

                let link = require("./link");
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

            let run = require("./run");
            let packageName = process.argv[3];
            run(packageName, process.argv);
            break;
        }

        case "build": {

            if (process.argv.length === 4) {

                let build = require("./build");
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
