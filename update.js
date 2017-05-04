function update(packageCachePath) {

    let git = require(__dirname + "/node_modules/nodegit");
    let path = require("path");
    let fs = require("fs-extra");

    let packageCache = {};

    if (!fs.existsSync(packageCachePath)) {

        let fileString = JSON.stringify(packageCache);
        fs.writeFileSync(path.join(__dirname, packageCachePath), fileString);
    }
    else {

        packageCache = require(packageCachePath);
    }

    let config = require(__dirname + "/config.json");


    for (let i = 0; i < config.repositories.length; ++i) {

        let repoPath = __dirname + "/repositories/" + config.repositories[i].name;

        console.log("Getting package list from repository: " + config.repositories[i].name);

        let url;
        let location = config.repositories[i].location;

        switch (location.type) {

            case "github": {

                url = "https://github.com/" + location.user + "/" + location.repository + ".git";
                downloadRepositoryGithub(url, repoPath, packageCache, config.repositories[i], packageCachePath);
                break;
            }
            default: {

                console.log("Package location type not recognised");
            }
        }
    }
}

function downloadRepositoryGithub(url, repoPath, packageCache, currentRepo, packageCachePath) {

    let fs = require("fs-extra");
    let git = require(__dirname + "/node_modules/nodegit");
    let path = require("path");

    git.Clone(url, repoPath)
    .then(function() {

        let repoContents = require(repoPath + "/registry.json");
        packageCache[currentRepo.name] = repoContents;

        let fileString = JSON.stringify(packageCache);
        fs.writeFileSync(path.join(__dirname, packageCachePath), fileString);
    })
    .then(function() {

        fs.removeSync(__dirname + "/repositories");
    })
    .catch(function(err) {

        console.log(err);
    });
}

module.exports.update = update;
