function init(type) {

    if (type !== "udo" && type !== "csd") {

        console.log("Unknown initialisation type " + type + " exiting.");
        process.exit(-1);
    }

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

    jsonObject[type] = {};
    let response = "";

    while(response.localeCompare("no") !== 0 && response.localeCompare("yes") !== 0) {

        response = readlineSync.question("Would you like to create a skeleton entrypoint file? (yes|no)\n> ")
    }

    nameSuggestion += "." + type;
    jsonObject[type].entrypoint = readlineSync.question('Entrypoint file name: (' + nameSuggestion + ')\n> ');
    jsonObject[type].entrypoint = jsonObject[type].entrypoint === "" ? nameSuggestion : jsonObject[type].entrypoint;

    switch (type) {

        case "udo": {

            initialiseUdo(jsonObject, response);
            break;
        }
        case "csd": {

            initialiseCsd(jsonObject, response);
            break;
        }

        default:
    }

    let jsonfile = require('jsonfile')

    let fileName = 'csp.json'

    jsonfile.writeFileSync(fileName, jsonObject);
}

function initialiseUdo(jsonObject, createEntrypoint) {

    let readlineSync = require('readline-sync');

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

        function createArguments(type) {

            response = readlineSync.question("Enter " + type + " arguments seperated by commas\n> ")
            response = response.split(',').map(s => s.trim());

            return processArguments(response);
        }

        jsonObject.udo.inputs = createArguments('input');
        jsonObject.udo.outputs = createArguments('output');
    }
    else {

        let fs = require('fs');
        let udoEntrypoint = fs.readFileSync(jsonObject.udo.entrypoint, 'utf8');
        let udoEntryPointLines = udoEntrypoint.split('\n');

        for (let i = 0; i < udoEntryPointLines.length; i++) {

            let replacement = "";
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

function initialiseCsd(jsonObject, createEntrypoint) {

    let readlineSync = require('readline-sync');

    console.log(jsonObject);
}

module.exports.init = init;
