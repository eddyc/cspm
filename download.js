function downloadFile(url, destinationFolder, fileName, finishedCallback) {

    var fs = require('fs');
    var request = require('request');
    var progress = require('request-progress');

    if (!fs.existsSync(destinationFolder)) {

        fs.mkdirSync(destinationFolder);
    }

    let filePath = destinationFolder + fileName;

    progress(request(url))
    .on('progress', function (state) {
        // console.log('progress', state.percent);
    })
    .on('error', function (err) {
        // console.log("Error");
    })
    .on('end', function () {

        finishedCallback(filePath, destinationFolder);
    })
    .pipe(fs.createWriteStream(filePath));

}

function downloadAndUnzipFile(packageName, repoPackageJson, callback) {

    downloadPackage(packageName, repoPackageJson, function(filePath, folderPath) {

        unzipFile(filePath, folderPath, function() {

            let newPath = renameUnzippedDirectory(packageName, folderPath);

            let fs = require('fs');
            fs.unlinkSync(filePath);

            callback(folderPath);

        });
    });
}

function downloadPackage(fileName, packageJson, finishedCallback) {

    let downloadFolderPath = "./download." + fileName + "/";

    let fs = require("fs-extra");
    if (fs.existsSync(downloadFolderPath)) {

        fs.removeSync(downloadFolderPath);
    }

    switch (packageJson.location.type) {

        case "github": {

            let releaseUrl = "https://github.com/" +
            packageJson.location.user +
            "/" +
            packageJson.location.repository +
            "/archive/" +
            packageJson.version +
            ".zip";

            downloadFile(releaseUrl, downloadFolderPath, fileName + ".zip", finishedCallback)

            break;
        }
        default:
    }
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

function unzipFile(filePath, folderPath, finishedCallback) {

    let fs = require('fs-extra');
    let unzip = require('unzip');

    let stream = fs.createReadStream(filePath).pipe(unzip.Extract({ path: folderPath }));

    stream.on('close', function() {

        finishedCallback();
    });
}

function renameUnzippedDirectory(newName, folderPath) {

    const subdirectories = require('filehound').create().path(folderPath).directory().findSync();

    let newPath = folderPath + newName;

    for (let i = 0; i < subdirectories.length; i++) {

        if (subdirectories[i].includes(newPath.split("/")[2]) === true) {
            let mv = require('mv');
            mv(subdirectories[i], newPath, function(err) {

                if (typeof err != 'undefined') {

                    console.log("errored: " + err);
                }
            });

            return newPath;
        }
    }
}


module.exports.downloadAndUnzipFile = downloadAndUnzipFile;
