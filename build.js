function build(buildType, buildObject) {


    let cspJson = require(process.cwd() + "/csp");

    switch (buildType) {

        case 'csd': {

            buildCsd(cspJson);
            break;
        }
        case 'readme': {

            buildReadme(buildObject);
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

function buildReadme(buildObject) {

    let fs = require("fs-extra");
    let cspJson = require(process.cwd() + "/csp");

    let md = "# "
    + cspJson.name + "\n\n"
    + cspJson.description + "\n\n"
    + "### Author" + "\n\n"
    + cspJson.author
    + "\n\n### Email" + "\n\n"
    + cspJson.email
    + "\n\n### Version\n\n" + cspJson.version
    + "\n\n### Dependencies\n\n";

    let dependencies = "";
    for (let dependency in cspJson.dependencies) {

        dependencies += dependency + " ";
    }

    dependencies = dependencies.trim() === "" ? "None" : dependencies;
    md += dependencies + "\n\n";
    md += "## Inputs \n";

    function writeArguments(type) {

        let argumentArray = cspJson[buildObject][type];

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


    writeArguments("inputs");

    md += "\n\n## Outputs \n";

    writeArguments("outputs");

    fs.writeFileSync(process.cwd() + "/README.md", md);

    console.log(cspJson);
}

module.exports = build;
