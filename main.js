(function main() {

    if (process.argv.length < 3) {

        console.log("cspm: Error, not enough arguments.");
        process.exit();
    }

    let option = process.argv[2];
    let packageCachePath = "./package-cache.json";

    switch (option) {

        case "init": {

            if (process.argv.length === 4) {

                let init = require('./init').init;
                let type = process.argv[3];
                init(process.argv[3]);
            }
            break;
        }
        case "update": {

            let update = require("./update").update;
            update(packageCachePath);
            break;
        }
        case "install": {

            let install = require("./install").install;

            if (process.argv.length === 4) {
                console.log("this won't work now!");
                process.exit();
                // let file = process.argv[3];
                // install(file, packageCachePath, function() {});
            }
            else if (process.argv.length === 3) {

                let csp = require(process.cwd() + '/csp.json');
                let packageCache = require(packageCachePath);
                let buildDependencyList = require('./dependency').buildDependencyList;
                let dependencyList = buildDependencyList(csp.dependencies, packageCache);

                function installRecursive() {

                    dependencyList.pop();
                    if (dependencyList.length > 1) {

                        install(dependencyList[dependencyList.length - 1], packageCachePath, installRecursive, false);
                    }
                    else {

                        install(dependencyList[dependencyList.length - 1], packageCachePath, function(){}, true);
                    }
                }

                install(dependencyList[dependencyList.length - 1], packageCachePath, installRecursive);
            }
            break;
        }
        case "build": {

            if (process.argv.length === 4) {

                let build = require("./build");
                let buildType = process.argv[3];
                build(buildType);
            }
            else if (process.argv.length === 5) {

                let build = require("./build");
                let buildType = process.argv[3];
                let buildObject = process.argv[4];
                build(buildType, buildObject);
            }
            else {

                console.log("Error: no build type specified");
            }
            break;

        }
        case "readme": {

            if (process.argv.length === 4) {

                let fileName = process.argv[3];

                readme(fileName);
            }
            else {

                console.log("Error: no file name specified");
            }
            break;
        }
        default: {

            console.log("Usage:");
            console.log("cspm update");
            console.log("cspm install");
            console.log("cspm install <package-name>");
        }

    }
})();