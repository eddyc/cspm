function install(fileName, packageCachePath, callback, clean) {

    let packageCache = require(packageCachePath);
    let packageJson = searchPackageCacheForPackage(fileName, packageCache);

    if (packageJson !== false) {

        downloadPackage(fileName, packageJson, callback, clean);
    }
    else {

        console.log("Error: Package not found");
    }
}

function downloadPackage(fileName, packageJson, callback, clean) {

    switch (packageJson.location.type) {

        case "github": {

            downloadPackageGithub(fileName, packageJson, callback, clean);
            break;
        }
        default:
    }
}

function downloadPackageGithub(fileName, packageJson, callback, clean) {

    let Octokit = require('octokit');
    let gh = Octokit.new();

    let releaseUrl = "https://github.com/" +
    packageJson.location.user +
    "/" +
    packageJson.location.repository +
    "/archive/" +
    packageJson.version +
    ".zip";

    var fs = require('fs');
    var request = require('request');
    var progress = require('request-progress');

    if (!fs.existsSync(".tmp")) {

        fs.mkdirSync(".tmp");
    }

    let tmpFilePath = ".tmp/" + fileName + ".zip";

    progress(request(releaseUrl))
    .on('progress', function (state) {
        // console.log('progress', state.percent);
    })
    .on('error', function (err) {
        // console.log("Error");
    })
    .on('end', function () {

        unzipPackage(tmpFilePath, packageJson, callback, clean, fileName);
    })
    .pipe(fs.createWriteStream(tmpFilePath));
}


function unzipPackage(packageZipPath, packageJson, callback, clean, fileName) {

    let fs = require('fs-extra');
    let unzip = require('unzip');
    let stream = fs.createReadStream(packageZipPath).pipe(unzip.Extract({ path: "./.tmp" }));

    if (!fs.existsSync("./packages")) {

        fs.mkdirSync("./packages");
    }

    stream.on('close', function() {

        callback();

        if (clean === true) {

            const subdirectories = require('filehound').create().path(".tmp").directory().findSync();
            let mv = require('mv');

            for (let i = 0; i < subdirectories.length; i++) {

                let newPath = subdirectories[i].split(".")[1].split("/")[1];
                mv(subdirectories[i], "./packages/" + newPath, function(err) {});
            }

            fs.removeSync("./.tmp");
        }
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

module.exports.install = install;
