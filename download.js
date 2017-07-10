function downloadFile(user, url, destinationFolder, fileName, finishedCallback) {

    var fs = require('fs');
    var request = require('request');
    var progress = require('request-progress');

    if (!fs.existsSync(destinationFolder)) {

        fs.mkdirSync(destinationFolder);
    }

    let filePath = destinationFolder + fileName;

    var options = {
        host: 'api.github.com',
        path: '/users/' + user + '/repos',
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };

    progress(request(url, options))
    .on('progress', function (state) {

        // console.log(state);
    })
    .on('error', function (err) {
    })
    .on('end', function () {

        finishedCallback(filePath, destinationFolder);
    })
    .pipe(fs.createWriteStream(filePath));

}

function downloadAndUnzipFile(packageCoordinates, callback) {

    downloadPackage(packageCoordinates, function(filePath, folderPath) {


        unzipFile(filePath, folderPath, function() {

            let newPath = renameUnzippedDirectory(packageCoordinates.repo, folderPath);

            let fs = require('fs');
            fs.unlinkSync(filePath);

            callback(folderPath);

        });
    });
}

function downloadPackage(packageCoordinates, finishedCallback) {

    let downloadFolderPath = "./download." + packageCoordinates.repo + "/";
    let fs = require("fs-extra");
    if (fs.existsSync(downloadFolderPath)) {

        fs.removeSync(downloadFolderPath);
    }

    let releaseUrl = "";

    if (packageCoordinates.version === "latest") {

        releaseUrl = "https://api.github.com/repos/" +
        packageCoordinates.user +
        "/" +
        packageCoordinates.repo +
        "/zipball";
    }
    else {

        releaseUrl = "https://github.com/" +
        packageCoordinates.user +
        "/" +
        packageCoordinates.repo +
        "/archive/" +
        packageCoordinates.version +
        ".zip";
    }

    // console.log("Release url is : " + releaseUrl);
    downloadFile(packageCoordinates.user, releaseUrl, downloadFolderPath, packageCoordinates.repo + ".zip", finishedCallback)

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
