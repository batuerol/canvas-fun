var updateTicks = 10;
var drawTicks = 10;
var updateInterval;
var drawInterval;

// Timers for update & draw loops.
function gameStart() {
    updateInterval = setInterval(update, updateTicks);
    drawInterval = setInterval(draw, drawTicks);
}

var _endGameFadeoutColor = 1;
function gameEnd() {
    var drawEnd = new Drawable(function (renderer) {
        renderer.fillRectangle(new Vector2(0, 0),
            renderer.canvas.width, renderer.canvas.height,
            "rgba(0, 0, 0," + _endGameFadeoutColor * 0.1 + ")");
    });

    // Fadeout effect
    g_CanvasRenderer.subscribe(drawEnd, 10);
    var colorInterval = setInterval(function () {
        _endGameFadeoutColor += 1;
        // NOTE(batuhan): This doesn't look pretty but floating point precision in 
        // JavaScript causes errors.
        if (_endGameFadeoutColor === 9) {
            clearInterval(colorInterval);

            displayResult();
        }
    }, 100);
}

function displayResult() {
    var drawResult = new Drawable(function (renderer) {
        var canvasHalf = new Vector2(renderer.canvas.width * 0.5, renderer.canvas.height * 0.5);
        var scorePosition = new Vector2(canvasHalf.x, canvasHalf.y - canvasHalf.x * 0.25);
        var bottom = new Vector2(scorePosition.x, scorePosition.y + scorePosition.x * 0.25);
        renderer.font = scorePosition.x * 0.01 + "em serif";
        renderer.putText(scorePosition, g_Score + " :(", "rgba(0, 255, 0, 1)", true);
        // Cookies are blocked on file:// protocol.
        renderer.putText(bottom, "Try Again Tomorrow", "rgba(0, 255, 0, 1)", true);
        // renderer.outlineText(position, g_Score, "rgba(255, 255, 255, 1)", true);
    });

    g_CanvasRenderer.subscribe(drawResult, 11);
}

// Main draw loop.
function draw() {
    g_CanvasRenderer.clearCanvas();
    g_CanvasRenderer.draw();
}

// Main update loop.
function update() {
    g_Bells.forEach(_update_callback);
    g_Dots.forEach(_update_callback);
    g_Buckets.forEach(_update_callback);

    if (g_Fireball != null) {
        g_Fireball.update();

        // Check if fireball reached the buckets.
        if (g_Fireball.position.y - g_Fireball.radius >= g_Buckets[0].position.y) {
            delete g_Fireball;
            g_Fireball = null;
            g_CanvasRenderer.unsubscribe(g_Fireball);
            updateScore();
        }
    }
}

function _update_callback(element) {
    if (element !== null) {
        element.update();
    }
}