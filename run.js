//TODO: Fix forward slash only paths here

function run(csdPackageName, argv) {

    let fs = require("fs");
    let packageDirectory = process.env.INCDIR + "/" + csdPackageName;
    let cspJson = require(fs.realpathSync(packageDirectory) + "/csp.json");

    if (typeof cspJson.udo !== 'undefined') {

        console.log("Error, cannot currently run a UDO, exiting");
        process.exit();
    }
    else if (typeof cspJson.csd === 'undefined') {

        console.log("Error, csd data undefined in csp.json, exiting");
        process.exit();
    }

    let readline = require("readline-sync");

    let entrypoint = cspJson.csd.entrypoint;
    let macros = cspJson.csd.macros;
    let argumentArray = argv.slice(4, argv.length);


    let compileArguments = ["csound", packageDirectory + "/" + entrypoint];

    if (macros.length > 0) {

        console.log("\nSpecify values for macros:");
        let readlineSync = require('readline-sync');

        if (argumentArray.length === macros.length) {

            for (let i = 0; i < macros.length; i++) {

                let macro = macros[i];
                compileArguments.push("--omacro:" + macro.symbol + "=" + process.cwd() + "/" + argumentArray[i]);
            }
        }
        else {

            for (let i = 0; i < macros.length; i++) {

                let macro = macros[i];
                let question = " " + macro.symbol + ": " + macro.description;
                response = readlineSync.question(question + "\n:");
                compileArguments.push("--omacro:" + macro.symbol + "=" + process.cwd() + "/" + response);
            }
        }
    }

    let command = compileArguments.join(" ");
    console.log(command);


    const exec = require('child_process').exec;
    const child = exec(command,
        (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    }

    module.exports = run;
