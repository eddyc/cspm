function build(buildType) {


    let cspJson = require(process.cwd() + "/csp");

    switch (buildType) {

        case 'csd': {

            buildCsd(cspJson);
            break;
        }
        case 'readme': {

            buildReadme(cspJson);
        }

        default:

    }
}


function buildCsd(cspJson) {


    let buildObject = cspJson["csd"];

    let getBuildDependencyList = require("./dependency").getBuildDependencyList;

    getBuildDependencyList();

    console.log(buildObject);

    let xmlbuilder = require("xmlbuilder");

    let csoptionsString = "\n";

    if (typeof buildObject.csoptions !== 'undefined') {

        for (let i = 0; i < buildObject.csoptions.length; i++) {

            csoptionsString += " -" + buildObject.csoptions[i];
        }
    }


    csoptionsString += "\n";

    for (let i = 0; i < buildObject.instruments.length; i++) {

        console.log(buildObject.instruments[i]);
    }


    let xml = xmlbuilder.create('CsoundSynthesizer', {
        headless:true
    })
    .ele('CsOptions')
    .txt(csoptionsString).up()
    .ele('CsInstruments')
    .txt("stuff").up()
    .end({pretty: true});

    console.log(xml);
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
    + "\n\n### Version\n\n" + cspJson.version
    + "\n\n### Dependencies\n\n";

    let getDependencyRepoUrl = require("./utilities").getDependencyRepoUrl;
    let dependencyUrlArray = [];
    for (let dependency in cspJson.dependencies) {

        dependency = cspJson.dependencies[dependency];
        let dependencyUrl = getDependencyRepoUrl(dependency);
        dependencyUrlArray.push("[" + dependency + "](" + dependencyUrl + ")");
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


    fs.writeFileSync(process.cwd() + "/README.md", md);
}

module.exports = build;
