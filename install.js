function getPackageCoordinates(string) {

    let splitString = string.split("/");
    let packageCoordinates = {};

    if (splitString.length < 2 || splitString.length > 3) {

        console.log("Error, package coordinates malformed either specify name/repo or name/repo/version\nExiting");
        return;
    }

    packageCoordinates.count = splitString.length;
    packageCoordinates.user = splitString[0];
    packageCoordinates.repo = splitString[1];

    if (splitString.length == 3) {

        packageCoordinates.version = splitString[2];
    }
    else {

        packageCoordinates.version = "latest";
    }
    return packageCoordinates;
}
function install(argv) {

    let packageCoordinates = {};
    let doInstallGlobal = true;

    if (argv.length === 4) {

        packageCoordinates = getPackageCoordinates(argv[3]);
    }
    else {

        console.log("Error, install command requires package coordinates, e.g: cspm install name/repo/version\nExiting");
        process.exit();
    }

    let packageInstalled = [argv[3]];

    console.log("Installing: " + packageCoordinates.repo);


    let installRecursive = function(cspJson){

        console.log("Installed: " + cspJson.name);
        for (let i = 0; i < cspJson.dependencies.length; ++i) {

            let dependencyCoordinates = getPackageCoordinates(cspJson.dependencies[i]);

            if (packageInstalled.indexOf(dependencyCoordinates) === -1) {

                console.log("Installing dependency: " + dependencyCoordinates.repo);

                installPackage(dependencyCoordinates, installRecursive);
                packageInstalled.push(cspJson.dependencies[i]);
            }
        }
    }

    installPackage(packageCoordinates, installRecursive, function(){console.log("Error installing packages.");});
}


function installPackage(packageCoordinates, doneCallback, errorCallback) {

    let downloadAndUnzipFile = require("./download").downloadAndUnzipFile;

    downloadAndUnzipFile(packageCoordinates, function(downloadFolderPath) {

        let cspJson = require(downloadFolderPath + packageCoordinates.repo + "/csp.json");
        let globalPackagePath = require("./utilities").getGlobalPackagePath();
        let destinationFolder = globalPackagePath + "/" + packageCoordinates.repo;
        let destinationPath = destinationFolder  + "/Versions/" + cspJson.version;
        let fs = require("fs-extra");

        if (fs.existsSync(destinationPath) === false) {

            movePackageFolder(packageCoordinates.repo, downloadFolderPath + packageCoordinates.repo, destinationFolder, cspJson);
        }
        else {

            fs.removeSync(downloadFolderPath);
        }


        doneCallback(cspJson);
    });
}

function getEntrypoint(cspJson) {

    if (typeof cspJson.csd !== 'undefined') {

        return cspJson.csd.entrypoint;
    }
    else if (typeof cspJson.udo !== 'undefined') {

        return cspJson.udo.entrypoint;
    }
    else {

        console.log("Error, could not find entrypoint\nExiting");
        process.exit();
    }
}
function movePackageFolder(packageName, downloadedPackagePath, destinationFolder, cspJson) {

    let fs = require("fs-extra");

    let destinationPath = destinationFolder  + "/Versions/" + cspJson.version;
    fs.ensureDirSync(destinationPath);

    if (fs.existsSync(destinationPath)) {

        fs.removeSync(destinationPath);
    }

    let mv = require('mv');

    mv(downloadedPackagePath, destinationPath, function(error) {

        fs.removeSync("./download." + packageName);
        let destination = destinationFolder + "/" + getEntrypoint(cspJson);
        let source = destinationPath + "/" + getEntrypoint(cspJson);

        if (fs.existsSync(destination)) {

            fs.removeSync(destination);
        }

        fs.symlinkSync(source, destination);

        if (typeof error != 'undefined') {

        }
    });
}

module.exports.install = install;
