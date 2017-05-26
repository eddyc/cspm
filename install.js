
function install(argv, packageCache) {

    let packageName = "";
    let doInstallGlobal = false;

    if (argv.length === 5 && argv[3] === '-g') {

        packageName = argv[4];
        doInstallGlobal = true;
    }
    else {

        console.log("Error, local install not implemented");
        process.exit();
    }

    let getInstallDependencyList = require("./dependency").getInstallDependencyList;
    let dependencies = packageCache["cspm-registry"].packages[packageName].dependencies;
    console.log("This package will install following dependencies: ", dependencies.join(", "));
    let dependencyList = getInstallDependencyList([packageName], packageCache);
    let installedPackagesStatus =

    installPackageList(dependencyList, packageCache, doInstallGlobal, function() {

        console.log("finished\n");
    }, function() {

        console.log("Error: Somethings gone wrong, the install attempt unsuccessful.");
    });
}

function installPackageList(packageList, packageCache, doInstallGlobal, doneCallback, errorCallback) {

    if (packageList.length > 0) {

        let currentPackage = packageList.pop();
        installPackage(currentPackage, packageCache, doInstallGlobal, function() {

            installPackageList(packageList, packageCache, doInstallGlobal, doneCallback, errorCallback);
        });
    }
    else {

        doneCallback();
    }
}
function movePackageFolder(packageName, downloadedPackagePath, destinationFolder) {

    let fs = require("fs-extra");

    if (!fs.existsSync(destinationFolder)) {

        fs.mkdirSync(destinationFolder);
    }

    let destinationPath = destinationFolder + "/" + packageName;

    if (fs.existsSync(destinationPath)) {

        fs.removeSync(destinationPath);
    }

    let mv = require('mv');

    mv(downloadedPackagePath, destinationPath, function(error) {

        fs.removeSync("./download." + packageName);

        if (typeof error != 'undefined') {

            // console.log(error);
        }
    });
}

function installPackage(packageName, packageCache, doInstallGlobal, doneCallback, errorCallback) {

    let repoPackageJson = searchPackageCacheForPackage(packageName, packageCache);

    if (repoPackageJson === false) {

        console.log("Package not found: " + packageName + ", try running update command");

        errorCallback();
        return -1;
    }

    console.log("Found: " + packageName);

    let downloadAndUnzipFile = require("./download").downloadAndUnzipFile;

    downloadAndUnzipFile(packageName, repoPackageJson, function(downloadFolderPath) {

        let globalPackagePath = require("./utilities").getGlobalPackagePath();

        if (doInstallGlobal === true) {

            movePackageFolder(packageName, downloadFolderPath + packageName, globalPackagePath);
        }

        doneCallback();
    });
}

function searchPackageCacheForPackage(packageName, packageCache) {

    for (let i in packageCache) {

        let packages = packageCache[i].packages;

        if (typeof packages[packageName] != 'undefined') {

            return packages[packageName];
        }
        else {

            return false;
        }
    }
}

function uninstall(argv, packageCache) {


}

module.exports.install = install;
module.exports.uninstall = uninstall;
