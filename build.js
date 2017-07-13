function build(buildType) {

    const path = require("path");
    let cspJsonPath = path.join(process.cwd(), "csp");
    let cspJson = require(cspJsonPath);

    switch (buildType) {

        case 'readme': {

            buildReadme(cspJson);
            break;
        }
        case 'README': {

            buildReadme(cspJson);
            break;
        }
        default: {

            console.log("Error no valid options specified, exiting");
        }
    }
}



function buildReadme(cspJson) {

    let fs = require("fs-extra");

    let md = "# "
    + cspJson.name + "\n\n"
    + cspJson.description + "\n\n"
    + "### Author" + "\n\n"
    + cspJson.author
    + "\n\n### Email" + "\n\n"
    + cspJson.email
    + "\n\n### Github Username\n\n" + cspJson.user
    + "\n\n### Github Repository Name\n\n" + cspJson.repo
    + "\n\n### Version\n\n" + cspJson.version
    + "\n\n### Dependencies\n\n";

    const path = require("path");
    let utilitiesPath = path.join(__dirname, "utilities");

    let getPackageCoordinates = require(utilitiesPath).getPackageCoordinates;
    let dependencyUrlArray = [];
    for (let dependency in cspJson.dependencies) {

        dependency = cspJson.dependencies[dependency];
        let packageCoordinates = getPackageCoordinates(dependency);
        let dependencyUrl = "https://www.github.com/";
        dependencyUrl += packageCoordinates.user;
        dependencyUrl += "/" + packageCoordinates.repo;

        dependencyUrlArray.push("[" + packageCoordinates.repo + "](" + dependencyUrl + ")");
    }

    let dependencies = dependencyUrlArray.join(", ");

    md += dependencies + "\n\n";

    if (typeof cspJson["udo"] !== 'undefined') {

        function writeUDOArguments(type) {

            let argumentArray = cspJson.udo[type];

            md += "\n| Name | Type | Rate | Minimum | Maximum | Description |\n"
            + "|---|---|---|---|---|---|\n";

            for (let i = 0; i < argumentArray.length; i++) {

                let argument = argumentArray[i];
                md += "| " + argument.name +
                " | " + argument.type +
                " | " + argument.rate +
                " | " + argument.minimum +
                " | " + argument.maximum +
                " | " + argument.description + " |\n";

            }

        }
        md += "## Inputs \n";

        writeUDOArguments("inputs");

        md += "\n\n## Outputs \n";

        writeUDOArguments("outputs");
    }
    else if (typeof cspJson["csd"] !== 'undefined') {

        if (cspJson.csd.macros.length > 0) {

            md += "\n## Macros \n";
            md += "\n| Symbol | Description |\n"
            + "|---|---|\n";

            for (var i = 0; i < cspJson.csd.macros.length; i++) {

                md += "| " + cspJson.csd.macros[i].symbol + " | " + cspJson.csd.macros[i].description + " |\n";
            }
        }

    }
    else {

        console.log("Unknown package type");
    }


    fs.writeFileSync(path.join(process.cwd(), "README.md"), md);
}

module.exports = build;
