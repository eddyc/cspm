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

            if (process.argv.length === 4) {

                let file = process.argv[3];
                let install = require("./install").install;
                install(file, packageCachePath);
            }
            else if (process.argv.length === 3) {

                let csp = require(process.cwd() + '/csp.json');
                let packageCache = require(packageCachePath);

                let dependencyList = buildDependencyList(csp.dependencies, packageCache);
                console.log(dependencyList);
                // var dirString = process.cwd();
                // let resolveDependencies = require("./install").resolveDependencies;
                // resolveDependencies(dirString, packageCachePath);
            }
            break;
        }
        case "build": {

            if (process.argv.length === 4) {

                let buildType = process.argv[3];

                build(buildType);
            }
            else {

                console.log("Error: no build type specified");
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

function build(buildType) {


    let cspJson = require(process.cwd() + "/csp");
    let buildObject = cspJson[buildType];

    switch (buildType) {

        case 'csd': {

            buildCsd(buildObject);
            break;
        }

        default:

    }
}

function resolveDependencies() {

    const Node = require("./Node.js");
    const resolveDependencyTree = require("./DependancyResolver.js").resolveDependencyTree;

    let instr1 = new Node('instr1');
    let instr2 = new Node('instr2');
    let udoMain1 = new Node('udoMain1');
    let udoMain2 = new Node('udoMain2');
    let udoA = new Node('udoA');
    let udoB = new Node('udoB');
    let udoC = new Node('udoC');
    let csd = new Node('csd');

    instr1.addEdge(udoMain1);
    udoMain1.addEdge(udoA);
    udoA.addEdge(udoB);

    instr2.addEdge(udoMain2);
    udoMain2.addEdge(udoB);
    udoMain2.addEdge(udoC);

    csd.addEdge(instr1);
    csd.addEdge(instr2);

    let result = resolveDependencyTree(csd);

    console.log(result);
}

function buildDependencyList(dependencies, packageCache) {

    let dependencyList = [];
    const Node = require("./Node.js");
    const resolveDependencyTree = require("./DependancyResolver.js").resolveDependencyTree;


    function buildTree(dependencies, tree) {

        if (Object.keys(dependencies).length != 0) {

            for (let dependency in dependencies) {

                let currentDependencyArray = [];

                for (let repository in packageCache) {

                    let currentDependency = packageCache[repository].packages[dependency];

                    if (typeof currentDependency != 'undefined') {

                        currentDependency.name = dependency;
                        currentDependencyArray.push(currentDependency);
                    }
                }

                // Ask which one perhaps in the future?

                tree.addEdge(new Node(currentDependencyArray[0].name));

                buildTree(currentDependencyArray[0].dependencies, tree.edges[tree.edges.length - 1]);

                return tree;
            }
        }

    }

    let head = new Node('head');
    let tree = buildTree(dependencies, head);

    let result = resolveDependencyTree(tree);
    result.pop();


    return result;
}

function buildDependencyTree(dependencies)
{

}

function buildCsd(buildObject) {

    resolveDependencies();

    console.log(buildObject);

    let xmlbuilder = require("xmlbuilder");

    let csoptionsString = "\n";

    for (let i = 0; i < buildObject.csoptions.length; i++) {

        csoptionsString += " -" + buildObject.csoptions[i];
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
