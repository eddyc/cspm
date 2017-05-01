function install(file, packageCachePath) {

    let packageCache = require(packageCachePath);
    let packageFound = false;

    let result = searchPackageCacheForPackage(file, packageCache);

    if (result != false) {

        downloadPackage(result);
    }
    else {

        console.log("Error: Package not found");
    }
}

function downloadPackage(currentPackage) {

    switch (currentPackage.location.type) {

        case "github": {

            downloadPackageGithub(currentPackage);
            break;
        }
        default:
    }
}

function downloadPackageGithub(currentPackage) {

    var Octokit = require('octokit');
    var gh = Octokit.new();

    var repo = gh.getRepo(currentPackage.location.user, currentPackage.location.repository);

    repo.getReleases().then(function(releases) {

        let releaseUrl = "https://github.com/" +
        currentPackage.location.user +
        "/" +
        currentPackage.location.repository +
        "/archive/" +
        releases[0].tag_name +
        ".zip";

        var fs = require('fs');
        var request = require('request');
        var progress = require('request-progress');

        if (!fs.existsSync(".tmp")) {

            fs.mkdirSync(".tmp");
        }

        progress(request(releaseUrl))
        .on('progress', function (state) {
            // console.log('progress', state.percent);
        })
        .on('error', function (err) {
            // console.log("Error");
        })
        .on('end', function () {

            unzipPackage(".tmp/" + currentPackage.name + ".zip", currentPackage);
        })
        .pipe(fs.createWriteStream(".tmp/" + currentPackage.name + ".zip"));
    });
}


function unzipPackage(packageZipPath, currentPackage) {

    let fs = require('fs-extra');
    let unzip = require('unzip');
    let stream = fs.createReadStream(packageZipPath).pipe(unzip.Extract({ path: "./.tmp" }));
    let mv = require('mv');

    if (!fs.existsSync("./packages")) {

        fs.mkdirSync("./packages");
    }

    stream.on('close', function() {

        const Filehound = require('filehound');

        const subdirectories = Filehound.create()
        .path(".tmp")
        .directory()
        .findSync();

        for (let i = 0; i < subdirectories.length; i++) {

            mv(subdirectories[i], "./packages/" + currentPackage.name, function(err) {});
        }

        fs.removeSync("./.tmp");
    });
}

function searchPackageCacheForPackage(packageName, packageCache) {

    let packageFound = false;

    for (let i in packageCache) {

        for (let j = 0; j < packageCache[i].packages.length; ++j) {

            let currentPackage = packageCache[i].packages[j];

            if (packageName === currentPackage.name) {

                packageFound = true;

                return currentPackage;
            }
        }
    }

    return false;
}

function resolveDependencies(currentPath, packageCachePath) {

    let fs = require('fs');
    let path = require('path');
    let packageCache = require(packageCachePath);
    let csp = require(currentPath + '/csp.json');

    let dependencies = csp.dependencies;

    for (let dependency in dependencies) {

        let currentDependency = searchPackageCacheForPackage(dependency, packageCache);

        if (currentDependency != false) {

            downloadPackage(currentDependency);
        }
        else {

            console.log("Error: could not find package " + dependency + ", exiting");
            process.exit();
        }
    }
}

module.exports.install = install;
module.exports.resolveDependencies = resolveDependencies;
