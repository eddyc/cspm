module.exports = class Node {
    constructor(name) {
        this.name = name;
        this.edges = [];
    }

    addEdge(node) {

        this.edges.push(node);
    }
}
