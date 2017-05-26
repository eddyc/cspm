function getGlobalPackagePath() {

    let globalPackagePath = process.env.INCDIR;

    if (typeof globalPackagePath === 'undefined') {

        console.log("CSPM installed but INCDIR is undefined, nowhere specified to install packages\nIn your .bashrc or .zshrc please add for example:\nexport INCDIR=/Users/me/csound-packages\n\n");
        process.exit();
    }
    else {

        return globalPackagePath;
    }
}

function askQuestion(question, answers, defaultAnswerIndex) {

    let readlineSync = require('readline-sync');

    let response = "";

    function checkArrayForString(array, string) {

        for (let i = 0; i < array.length; ++i) {

            if (array[i].localeCompare(string) === 0) {

                return true;
            }
        }

        return false;
    }

    while(checkArrayForString(answers, response) === false) {

        response = readlineSync.question(question + " (" + answers.join(", ") + ") default:" + answers[defaultAnswerIndex] + "\n> ");

        if (response === "") {

            response = answers[defaultAnswerIndex];
        }

        console.log(response);
    }

    return response;
}



function getDependencyRepoUrl(dependency) {

    let packageCachePath = __dirname + "/package-cache.json";

    if (typeof packageCachePath === 'undefined') {

        console.log("No package lists available, run: cspm update");
        process.exit();
    }

    let packageCache = require(packageCachePath);

    let dependencyLocationInfo = packageCache["cspm-registry"].packages[dependency].location;

    let dependencyUrl = "";

    if (dependencyLocationInfo.type === "github") {

        dependencyUrl += "https://www.github.com/";
        dependencyUrl += dependencyLocationInfo.user;
        dependencyUrl += "/" + dependencyLocationInfo.repository;
    }

    return dependencyUrl;
}

function uniqueArray(array) {

    if (array.length === 1 || array.length === 0) {

        return array;
    }

    array = array.sort();

    let currentString = array[0];

    let newArray = [currentString];

    for (let i = 1; i < array.length; ++i) {

        console.log(currentString);
        if (array[i] !== currentString) {

            newArray.push(array[i]);
            currentString = array[i];
        }

    }
    return newArray;
}

function getInstalledPackages() {

    let installedPackages = [];

    let installPath = process.env.INCDIR;

    const subdirectories = require('filehound').create().path(installPath).directory().findSync();

    for (let i = 0; i < subdirectories.length; i++) {

        let cspJson = require(subdirectories[i] + "/csp.json");
        installedPackages.push(cspJson.name);
    }

    return installedPackages;
}

module.exports = {

    "getGlobalPackagePath" : getGlobalPackagePath,
    "askQuestion" : askQuestion,
    "getDependencyRepoUrl" : getDependencyRepoUrl,
    "uniqueArray" : uniqueArray,
    "getInstalledPackages" : getInstalledPackages
};
