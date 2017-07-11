function link(packageName) {

    let getInstalledPackages = require("./utilities").getInstalledPackages;
    let installedPackages = getInstalledPackages();

    if (installedPackages.includes(packageName) === false) {

        console.log("Error, requested package for linking is not installed");
    }
    else {

        const fs = require("fs");
        
        let packageDirectory = process.env.INCDIR + "/" + packageName;
        let cspJson = require(fs.realpathSync(packageDirectory) + "/csp.json");


        if (typeof cspJson.udo !== 'undefined') {

            console.log("Error, cannot link UDOs");
        }
        else if (typeof cspJson.csd !== 'undefined') {

            console.log("Linking csd");
            let fs = require("fs");
            let filePath = '/usr/local/bin/' + cspJson.name;

            fs.writeFile(filePath, '#!/usr/bin/env bash\ncspm run ' + cspJson.name + ' "$@"', function (err) {
                if (err) throw err;
                fs.chmodSync(filePath, '755');
            });

        }
        else {

            console.log("Somethings wrong, cannot find udo or csd properties in csp.json, exiting...");
            process.exit();
        }

    }
}

module.exports = link;
