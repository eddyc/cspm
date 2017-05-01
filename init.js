function init(type) {

    console.log("Initialising Csound package:");

    let readlineSync = require('readline-sync');
    let jsonObject = {};

    jsonObject.name = readlineSync.question('Package name:\n> ');
    jsonObject.version = readlineSync.question('Version: (1.0.0)\n> ');
    jsonObject.version = jsonObject.version === "" ? "1.0.0" : jsonObject.version;

    jsonObject.dependencies = readlineSync.question('Dependencies seperated by commas:\n> ').split(',').map(s => s.trim());
    
    if (jsonObject.dependencies.length === 1 && jsonObject.dependencies[0] === "") {
        jsonObject.dependencies = [];
    }

    switch (type) {
        case "udo": {

            initialiseUdo(jsonObject);
            break;
        }

        default:

    }
    var jsonfile = require('jsonfile')

    var fileName = 'cps.json'

    jsonfile.writeFileSync(fileName, jsonObject);
}

function initialiseUdo(jsonObject) {

    let readlineSync = require('readline-sync');
    jsonObject.udo = {};
    let response = "";

    while(response.localeCompare("no") !== 0 && response.localeCompare("yes") !== 0) {

        response = readlineSync.question("Would you like to create a skeleton entrypoint file? (yes|no)\n> ")
    }

    jsonObject.udo.entrypoint = readlineSync.question('entrypoint file name:\n> ');

    function processArguments(response) {

        let argumentsData = [];

        for (let i = 0; i < response.length; ++i) {

            let argument = {name:response[i]};
            argument.description = readlineSync.question(argument.name + " description:\n> ");
            argument.maximum = readlineSync.question(argument.name + " maximum:\n> ");
            argument.minimum = readlineSync.question(argument.name + " minimum:\n> ");
            argumentsData.push(argument);
        }

        return argumentsData;
    }

    if (response === "yes") {

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

module.exports.init = init;
