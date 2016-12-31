class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    // Color the graph for debugging
    colorize(node, color) {
        g_Dots[node.data.index].color = color;
        if (node.left != null) {
            this.colorize(node.left, color);
        }
        if (node.right != null) {
            this.colorize(node.right, color);
        }
    }

    findPaths(targetDot) {
        this.paths = [];
        this.connectionPath = [];
        this._findPath(this, targetDot);
        return this.paths;
    }

    // Modified Breadth-first search algorithm to find all the paths
    _findPath(node, targetDot) {
        if (node.data.index === targetDot) {
            var temp = [];
            for (var i = 0; i < this.connectionPath.length; ++i) {
                temp.push(this.connectionPath[i]);
            }
            temp.push(node.data.index);
            this.paths.push(temp);
        } else {
            this.connectionPath.push(node.data.index);
            if (node.left !== null)
                this._findPath(node.left, targetDot);
            if (node.right !== null)
                this._findPath(node.right, targetDot);
            this.connectionPath.pop();
        }
    }

}

