function init(type) {

    let fs = require("fs");

    if (type !== "udo" && type !== "csd" && type !== "build") {

        console.log("Unknown initialisation type " + type + " exiting.");
        process.exit(-1);
    }

    let askQuestion = require("./utilities").askQuestion;


    if (fs.existsSync("./csp.json")) {

        let response = askQuestion("csp.json exists, re-initialise?", ["yes", "no"], 1);

        if (response === "no") {

            console.log("OK, exiting....");
            process.exit();
        }
    }

    let jsonObject = initialiseGeneral();
    
    switch (type) {

        case "udo": {

            jsonObject = initialiseUdo(jsonObject);
            break;
        }
        case "csd": {

            jsonObject = initialiseCsd(jsonObject);
            break;
        }
        case "build": {

            console.log("Not implemented yet");
            process.exit();
        }
        default:
    }


    let jsonfile = require('jsonfile');

    let fileName = 'csp.json';

    jsonfile.writeFileSync(fileName, jsonObject);
}

function initialiseGeneral() {

    console.log("Initialising Csound package:");

    let readlineSync = require('readline-sync');

    let jsonObject = {};
    let nameSuggestion = process.cwd().split("/").slice(-1)[0];
    jsonObject.name = readlineSync.question('Package name: (' + nameSuggestion + ')\n> ');
    jsonObject.name = jsonObject.name === "" ? nameSuggestion : jsonObject.name;
    jsonObject.version = readlineSync.question('Version: (1.0.0)\n> ');
    jsonObject.version = jsonObject.version === "" ? "1.0.0" : jsonObject.version;
    jsonObject.author = readlineSync.question('Author: \n> ');
    jsonObject.email = readlineSync.question('Email: \n> ');
    jsonObject.description = readlineSync.question('Description: (Audio DSP using Csound)\n> ');
    jsonObject.description = jsonObject.description === "" ? "Audio DSP using Csound" : jsonObject.description;
    jsonObject.dependencies = readlineSync.question('Dependencies seperated by commas:\n> ').split(',').map(s => s.trim());

    if (jsonObject.dependencies.length === 1 && jsonObject.dependencies[0] === "") {

        jsonObject.dependencies = [];
    }

    return jsonObject;

}

function initialiseUdo(jsonObject) {

    let fs = require('fs');

    let readlineSync = require('readline-sync');

    jsonObject.udo = {};
    let createEntrypoint = "";
    let nameSuggestion = process.cwd().split("/").slice(-1)[0];
    let suggestedFileExists = fs.existsSync("./" + nameSuggestion + ".udo");

    while(createEntrypoint.localeCompare("no") !== 0 && createEntrypoint.localeCompare("yes") !== 0) {

        let suggestFileExists = "perhaps yes, no appropriate udo files found";
        if (suggestedFileExists == true) {

            suggestedFileExists = " perhaps not, " + nameSuggestion + ".udo exists";
        }
        createEntrypoint = readlineSync.question("Would you like to create a skeleton entrypoint file? (yes|no)" + suggestedFileExists + "\n> ")
    }

    function processArguments(argumentList) {

        let argumentsData = [];

        for (let i = 0; i < argumentList.length; ++i) {

            let argument = {name:argumentList[i]};
            let currentArgument = "";

            while(currentArgument.localeCompare("s") !== 0
            &&
            currentArgument.localeCompare("scalar") !== 0
            &&
            currentArgument.localeCompare("a") !== 0
            &&
            currentArgument.localeCompare("array") !== 0
            &&
            currentArgument.localeCompare("f") !== 0
            &&
            currentArgument.localeCompare("fsig") !== 0
            &&
            currentArgument.localeCompare("S") !== 0
            &&
            currentArgument.localeCompare("string") !== 0) {

                currentArgument = readlineSync.question(argument.name + " type ( array|a || scalar|s || fsig|f || string|S ):\n> ");

                currentArgument = currentArgument == "a" ? "array" : currentArgument == "s" ? "scalar" : currentArgument === "f" ? "fsig" : currentArgument == "S" ? "string" : currentArgument;
            }

            argument.type = currentArgument;

            if (argument.type === "array" || argument.type === "scalar") {

                let rate = "";

                while(rate.localeCompare("i") !== 0
                &&
                rate.localeCompare("k") !== 0
                &&
                rate.localeCompare("a") !== 0) {

                    let suggestedRate = argument.name[0] === "a" ? "a" : argument.name[0] === "i" ? "i" : argument.name[0] === "k" ? "k" : "";
                    rate = readlineSync.question(argument.name + " rate ( i | k | a ) (" + suggestedRate + "):\n> ");
                    rate = rate === "" ? suggestedRate : rate;
                }

                argument.rate = rate;
            }

            argument.description = readlineSync.question(argument.name + " description:\n> ");

            if (argument.type === "scalar") {

                argument.maximum = readlineSync.question(argument.name + " maximum:\n> ");
                argument.minimum = readlineSync.question(argument.name + " minimum:\n> ");
            }

            argumentsData.push(argument);
        }

        return argumentsData;
    }

    if (createEntrypoint === "yes") {

        nameSuggestion += ".udo";
        jsonObject.udo.entrypoint = readlineSync.question('Entrypoint file name: (' + nameSuggestion + ')\n> ');
        jsonObject.udo.entrypoint = jsonObject.udo.entrypoint === "" ? nameSuggestion : jsonObject.udo.entrypoint;

        function createArguments(type) {

            response = readlineSync.question("Enter udo " + type + " arguments seperated by commas\n> ")
            response = response.split(',').map(s => s.trim());

            return processArguments(response);
        }

        jsonObject.udo.inputs = createArguments('input');
        jsonObject.udo.outputs = createArguments('output');
    }
    else {

        let entrypointFileName = "";

        do {

            entrypointFileName = readlineSync.question("Entrypoint file name:\n> ")
        }
        while(fs.existsSync("./" + entrypointFileName) === false);


        jsonObject.udo.entrypoint = entrypointFileName;

        let udoEntrypoint = fs.readFileSync(jsonObject.udo.entrypoint, 'utf8');
        let udoEntryPointLines = udoEntrypoint.split('\n');

        for (let i = 0; i < udoEntryPointLines.length; i++) {

            let replacement = "";
            jsonObject.udo.inputs = [];
            jsonObject.udo.outputs = [];

            if (udoEntryPointLines[i].includes("xin")) {

                let inputs = udoEntryPointLines[i].replace("xin", "").split(",").map(s => s.trim());
                jsonObject.udo.inputs = processArguments(inputs)
            }
            else if (udoEntryPointLines[i].includes("xout")) {

                let outputs = udoEntryPointLines[i].replace("xout", "").split(",").map(s => s.trim());
                jsonObject.udo.outputs = processArguments(outputs)
            }
        }
    }

    return jsonObject;
}




function initialiseBuild(jsonObject, subtype) {

    let readlineSync = require('readline-sync');

    console.log(jsonObject);
}

function initialiseCsd(jsonObject) {

    let readlineSync = require('readline-sync');
    let fs = require("fs");
    jsonObject.csd = {};

    let nameEntrypoint = "";
    let nameSuggestion = process.cwd().split("/").slice(-1)[0];
    let suggestedFileName = "./" + nameSuggestion + ".csd";
    let suggestedFileExists = fs.existsSync(suggestedFileName);

    while(nameEntrypoint.localeCompare("no") !== 0 && nameEntrypoint.localeCompare("yes") !== 0) {

        let suggestFileExists = "perhaps yes, no appropriate csd files found";
        if (suggestedFileExists == true) {

            suggestedFileExists = ", defaulting to no if it is " + nameSuggestion + ".csd";
        }
        nameEntrypoint = readlineSync.question("Would you like to specify entrypoint file? (yes|no)" + suggestedFileExists + "\n> ");

        if (nameEntrypoint === "") {

            nameEntrypoint = suggestedFileExists ? "no" : "yes";
        }
    }

    console.log(nameEntrypoint);

    let entrypointFileName = "";

    if (nameEntrypoint === "yes") {

        let fileExists = false;

        do {

            entrypointFileName = readlineSync.question("Entrypoint file name:\n> ");
            fileExists = fs.existsSync("./" + entrypointFileName);

            if (fileExists === false) {

                console.log("File not found\n");
            }
            else {

                entrypointFileName = "./" + entrypointFileName;
            }

        } while (fileExists === false);
    }
    else {

        entrypointFileName = suggestedFileName;
    }

    jsonObject.csd.entrypoint = entrypointFileName;

    let fileString = fs.readFileSync(entrypointFileName, 'utf8');

    result = fileString.match(/(\$\b\S+\b)/ig);

    let uniqueArray = require("./utilities").uniqueArray;
    let macros = uniqueArray(result);
    jsonObject.csd.macros = [];

    if (macros.length > 0) {

        function addMacros(macroName) {

            let macroObject = {};
            macroObject.symbol = macroName;

            let response = readlineSync.question("Enter description for macro: " + macroName + "\n> ");
            macroObject.description = response;
            return macroObject;
        }

        for (let i = 0; i < macros.length; i++) {

            jsonObject.csd.macros.push(addMacros(macros[i]));
        }
    }

    return jsonObject;
}

module.exports.init = init;
