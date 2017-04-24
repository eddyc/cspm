let resolved = [];
let seen = [];

function resolver(node, resolved){

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

            resolver(edge, resolved);
        }
    }

    resolved.push(node);
}

function DependancyResolver(a) {

    resolved = [];
    seen = [];
    resolver(a, resolved)

    return resolved;
}

module.exports = DependancyResolver;
