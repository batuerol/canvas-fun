var g_Score = 0;
var g_ScoreGoal = 1000;
var g_BallsLeft = 3;
var g_TargetScore;
var g_BellSound;

// Main
window.onload = function () {
    var canvas = document.getElementById("gameCanvas");
    g_BellSound = document.getElementById("bellSound");
    canvas.addEventListener("click", canvasClick, false);
    document.getElementById("ballsLeft").innerHTML = g_BallsLeft;
    document.getElementById("score").innerHTML = g_Score;
    initializeScene(canvas);
};

function canvasClick(e) {
    if (g_Fireball != null) {
        return;
    }

    var mousePos = getMousePosition(e, g_Canvas);
    // Iterate over bells to check if it's clicked.
    g_Bells.forEach(function (element) {
        if (element.checkClick(mousePos)) {
            if (g_BallsLeft > 0) {
                --g_BallsLeft;
                document.getElementById("ballsLeft").innerHTML = g_BallsLeft;
                g_BellSound.play();

                var path = calculatePath(element);
                g_Fireball = element.dropFireball(path);
                g_CanvasRenderer.subscribe(g_Fireball, 1);
            }
        }
    });
}

function getMousePosition(e, canvas) {
    // Get exact mouse position in the canvas.
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    return new Vector2(x, y);
}

function updateScore() {
    g_Score += g_TargetScore;
    document.getElementById("score").innerHTML = g_Score + "";
    if (g_BallsLeft === 0) {        
        // TODO(batuhan): Cookies (file:// protocol doesn't allow us to use cookies.)
        gameEnd();
    }
}

// Find buckets which have less points than given parameter.
function findLessThan(max) {
    var result = [];
    for (var i = 0; i < g_Buckets.length; ++i) {
        if (g_Buckets[i].score < max) {
            result.push(g_Buckets[i]);
        }
    }

    return result;
}

function rightOrLeft() {
    if (MathHelper.goRight()) {
        return 0;
    } else {
        return -1;
    }
}

function calculatePath(bell) {
    // Select buckets depending on our score.
    // If we need 400 points to 1000 the game; this function call will
    // eliminate 400 and 450 point buckets so it won't exceed 1000.
    var available = findLessThan(g_ScoreGoal - g_Score);

    // NOTE(batuhan): We should never reach this
    if (available.length === 0) {
        console.log("Error");
        return;
    }

    // Select a bucket randomly out of "not winning" buckets.
    var targetBucket = null;    
    var probability = MathHelper.getRandomNumber(0, 5);    
    if (g_BallsLeft == 0 && probability >= 2) {
    // If this is our last ball, select the maximum score with 60% chance.
        available.sort(function (a, b) {
            if (a.score < b.score)
                return -1;
            else if (a.score > b.score)
                return 1;
            return 0;
        });

        targetBucket = available[available.length - 1];
    } else {
        targetBucket = available[MathHelper.getRandomNumber(0, available.length)];
    }

    var rowNo = g_NumberOfRows - 1;
    var endingDotIndex = -1;
    var targetBucketIndex = g_Buckets.indexOf(targetBucket);
    var lastDotIndex;

    // First and last buckets can only be reached from first & last dots above the buckets.
    if (targetBucketIndex == 0) {
        lastDotIndex = MathHelper.getDotIndex(rowNo, 0);
    } else if (targetBucketIndex == g_Buckets.length - 1) {
        lastDotIndex = MathHelper.getDotIndex(rowNo, 5);
    } else {
        var off = rightOrLeft();        
        lastDotIndex = MathHelper.getDotIndex(rowNo, targetBucketIndex + off);
    }
    // Get paths
    var paths = bell.graph.findPaths(lastDotIndex);

    // Select a path randomly.
    var path = paths[MathHelper.getRandomNumber(0, paths.length)];
    // NOTE(batuhan): Colorize final path.
    // for (var i = 0; i < path.length; ++i) {
    //     g_Dots[path[i]].color = "rgba(200, 200, 20, 1)";
    // }
    path.push(targetBucketIndex);
    g_TargetScore = targetBucket.score;
    return path;
}

window.onbeforeunload = function() {
    clearInterval(updateInterval);
    clearInterval(drawInterval);
}