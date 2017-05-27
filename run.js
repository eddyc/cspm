
function run(csdPackageName, argv) {

    let packageDirectory = process.env.INCDIR + "/" + csdPackageName;
    let cspJson = require(packageDirectory + "/csp.json");

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

    const csound = require('csound-api');
    const Csound = csound.Create()

    console.log(compileArguments);
    csound.CompileArgs(Csound, compileArguments);

    if (csound.Start(Csound) === csound.SUCCESS) {

        csound.Perform(Csound);
    }
    else {

        console.log("Problem starting Csound");
    }

    csound.Destroy(Csound);
}

module.exports = run;
