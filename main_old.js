const Node = require("./Node.js");
const DependancyResolver = require("./DependancyResolver.js");
const FileParser = require("./FileParser.js");

let fs = require("fs");
let path = require("path");

function walkSync(dir) {
    if (!fs.lstatSync(dir).isDirectory()) return dir;

    return fs.readdirSync(dir).map(f => walkSync(path.join(dir, f))); // `join("\n")`
}

let a = new Node('a');
let b = new Node('b');
let c = new Node('c');
let d = new Node('d');
let e = new Node('e');

a.addEdge(b);
a.addEdge(d);
b.addEdge(c);
b.addEdge(e);
c.addEdge(d);
c.addEdge(e);

let result = DependancyResolver(a);

console.log(result);


if (process.argv.length !== 3) {
    console.log("Usage: " + __filename + " CsoundPackage.csp");
    process.exit(-1);
}
let packageName = process.argv[2];
let config = require("./" + packageName + "/config.json");
let simple = require("./" + packageName + "/simple.json");
console.log(simple);
let files = walkSync(packageName);
let entrypointPath = "./" + packageName + "/" + config.entrypoint + ".orc";


console.log(files);
console.log(entrypointPath);

let dependencies = FileParser(entrypointPath);

console.log(dependencies);
