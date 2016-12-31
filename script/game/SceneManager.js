var g_Canvas;
var g_Context;
var g_Bells = [];
var g_Dots = [];
var g_Buckets = [];
var g_Fireball = null;
var g_CanvasRenderer = null;
var g_NumberOfRows;
var g_BucketScores = [400, 250, 100, 1000, 50, 300, 450]

// Load textures and create renderer.
function initializeScene(canvas) {
    g_Canvas = canvas;
    g_CanvasRenderer = new CanvasRenderer(g_Canvas);

    var bellTexture = new Image();    
    bellTexture.onload = function () {
        createSceneObjects(bellTexture);
        gameStart();
    }    
    // This line makes sure bellTexture will not be null.    
    bellTexture.src = "images/bell.png";
}

// Game uses canvas.width and canvas.height to calculate every element's size.
function createSceneObjects(bellTexture) {    
    var canvas = g_Canvas;
    var bucketNumber = 7;
    var bucketWidth = canvas.width / bucketNumber;
    var bucketHeight = canvas.height * 0.1;
    createBuckets(0, canvas.height - bucketHeight, bucketWidth, bucketHeight, bucketNumber);

    var bellRadius = bucketWidth / 2.5;
    createBells(bucketWidth, bellRadius, bellRadius, 0, bellTexture);

    // Calculate distance between dots, starting points and dot radius.
    var dotStartY = bellRadius * 1.5 + canvas.height * 0.1;
    var rowOffset = bucketHeight / 1.5;
    var evenRowStart = g_Buckets[0].right;
    var oddRowStart = g_Buckets[0].center.x;
    var dotRadius = bellRadius / 5;
    var rowWidth = g_Buckets[6].left - evenRowStart;
    var offset = rowWidth / 5;
    var numberOfRows = Math.ceil(((canvas.height - bucketHeight) - dotStartY) / rowOffset);
    g_NumberOfRows = numberOfRows;
    createDots(evenRowStart, oddRowStart, offset, dotStartY, rowOffset, dotRadius, numberOfRows);

    // Create graph
    for (var i = 0; i < 6; ++i) {
        var root = new Node({ row: 0, column: i, index: i });
        getNodes(root, 0, i);
        g_Bells[i].graph = root;
    }

    // Debug lines to see if bells line up.
    // g_CanvasRenderer.subscribe(new Drawable(function (renderer) {
    //     renderer.drawLine(new Vector2(bucketWidth / 2, 0), new Vector2(bucketWidth / 2, canvas.height), "rgba(255, 0, 0, 1)");
    //     renderer.drawLine(new Vector2(canvas.width - bucketWidth / 2, 0), new Vector2(canvas.width - bucketWidth / 2, canvas.height), "rgba(255, 0, 0, 1)");
    // }), -1);
    // g_CanvasRenderer.subscribe(new Drawable(function (renderer) {
    //     renderer.drawLine(new Vector2(bucketWidth, 0), new Vector2(bucketWidth, canvas.height), "rgba(0, 255, 0, 1)");
    //     renderer.drawLine(new Vector2(canvas.width - bucketWidth, 0), new Vector2(canvas.width - bucketWidth, canvas.height), "rgba(0, 255, 0, 1)");
    // }), -1);
}

// Create graph for calculating the paths
function getNodes(parent, rowNumber, columnNumber) {
    if (rowNumber >= g_NumberOfRows)
        return;

    var leftNode = null;
    var rightNode = null;
    var leftOffset = 0;
    var rightOffset = 1;
    
    // Odd numbered rows have skewed indexes.
    if (!MathHelper.isEven(rowNumber)) {
        --leftOffset;
        --rightOffset;
    }

    var leftIndex = MathHelper.getDotIndex(rowNumber + 1, columnNumber + leftOffset);
    var rightIndex = MathHelper.getDotIndex(rowNumber + 1, columnNumber + rightOffset);

    if (leftIndex !== -1) {
        leftNode = new Node({ row: rowNumber + 1, column: columnNumber + leftOffset, index: leftIndex });
        // Recursion to fill left part of this node.
        getNodes(leftNode, leftNode.data.row, leftNode.data.column);
    }
    if (rightIndex !== -1) {
        rightNode = new Node({ row: rowNumber + 1, column: columnNumber + rightOffset, index: rightIndex });
        // Recursion to fill right part of this node.
        getNodes(rightNode, rightNode.data.row, rightNode.data.column);
    }

    parent.left = leftNode;
    parent.right = rightNode;
}

// Create and add buckets to renderer.
function createBuckets(startX, y, width, height, bucketNumber) {
    for (var i = 0; i < bucketNumber; ++i) {
        var bucket = new Bucket(new Vector2(startX + i * width, y), width, height,
            g_BucketScores[i]);
        g_Buckets.push(bucket);
        g_CanvasRenderer.subscribe(bucket, 2);
    }
}

// Create bells and add them to renderer.
function createBells(x, y, radius, margin, bellTexture) {
    var diameter = radius * 2;
    bellTexture.width = diameter;
    bellTexture.height = diameter;
    for (var i = 0; i < 6; ++i) {
        var bell = new Bell(new Vector2(x + (x * i), y),
            radius, (i + 1).toString(), bellTexture);
        g_Bells.push(bell);
        g_CanvasRenderer.subscribe(bell, 2);
    }
}

function createDots(firstRowStartX, secondRowStartX, xOffset, startY, yOffset, dotRadius, numberOfRows) {
    // NOTE(batuhan): Number of rows needs to be odd.
    if (MathHelper.isEven(numberOfRows)) {
        numberOfRows -= 1;
    }

    var color = "rgba(0, 0, 0, 1)";
    for (var row = 0; row < numberOfRows; ++row) {
        var evenRow = MathHelper.isEven(row);
        var numberOfDots = evenRow ? 6 : 7;
        // Number of dots and starting points change if row number is even or odd.
        var rowX = evenRow ? firstRowStartX : secondRowStartX;
        var rowY = startY + row * yOffset;

        createRowDots(rowX, rowY, xOffset, numberOfDots, dotRadius, color);
    }
}

// Create dots in a row and add them renderer.
function createRowDots(startX, y, offset, numberOfDots, dotRadius, color) {
    for (var i = 0; i < numberOfDots; ++i) {
        var dot = new Dot(new Vector2(startX + i * offset, y), dotRadius,
            color);
        g_Dots.push(dot);
        g_CanvasRenderer.subscribe(dot, 0);
    }
}
