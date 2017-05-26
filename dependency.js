class Node {

    constructor(name) {
        this.name = name;
        this.edges = [];
    }

    addEdge(node) {

        this.edges.push(node);
    }
}

function resolver(node, resolved, seen){

    seen.push(node);

    for (var i in node.edges) {

        let present = false;
        let edge = node.edges[i];

        for (var j in resolved) {

            if (edge.name === resolved[j].name) {

                present = true;
            }
        }

        if (present === false) {

            for (var j in seen) {

                if (edge.name == seen[j].name) {

                    throw 'Error: circular dependancy detected, exiting..';
                }
            }

            resolver(edge, resolved, seen);
        }
    }

    resolved.push(node);
}

function resolveDependencyTree(tree) {

    let resolved = [];
    let seen = [];
    resolver(tree, resolved, seen)

    return resolved;
}


function resolveDependencies() {

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

function getInstallDependencyList(dependencies, packageCache) {

    let dependencyList = [];

    console.log("getInstallDependencyList: change hard coded registry");

    packageListKeyArray = Object.keys(packageCache["cspm-registry"].packages);
    packageListObject = packageCache["cspm-registry"].packages;

    function buildTree(dependencies, node) {

        for (let i = 0; i < dependencies.length; i++) {

            let dependencyName = dependencies[i];
            let newNode = new Node(dependencyName);

            let newDependencies = packageListObject[dependencyName].dependencies;
            node.addEdge(newNode);
            buildTree(newDependencies, newNode);
        }

        return node;
    }

    let head = new Node('head');

    let tree = buildTree(dependencies, head);

    let result = resolveDependencyTree(tree).map(n => n.name);
    result.pop();

    return result;
}

function getBuildDependencyList(entrypointJson) {

    console.log("getBuildDependencyList");

}

module.exports.getInstallDependencyList = getInstallDependencyList;
module.exports.getBuildDependencyList = getBuildDependencyList;
