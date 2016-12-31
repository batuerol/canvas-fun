class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy(other) {
        this.x = other.x;
        this.y = other.y;
    }
}

class MathHelper {
    static isEven(number) {
        return number % 2 == 0;
    }

    // Check if x is in the range[n1, n2].
    static inRange(x, n1, n2) {
        return (x >= n1 && x <= n2);
    }

    // Check if point is in the given circle;
    static inCircle(circleCenter, circleRadius, point) {
        var distX = point.x - circleCenter.x;
        var distY = point.y - circleCenter.y;
        return distX * distX + distY * distY <= circleRadius * circleRadius;
    }

    // Return a random integer between min(inclusive), max(exclusive)
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Return exact index of row and column. Row and column starts from 0.
    static getDotIndex(row, column) {
        var evenRowLength = 6;
        var oddRowLength = 7;
        var common = evenRowLength + (oddRowLength - 1);

        if (row >= g_NumberOfRows) {
            return -1;
        }
        // NOTE(batuhan): It's guaranteed to have odd number of rows.
        var commonMultiplier = Math.floor(row / 2);
        var offset = commonMultiplier;
        if (!MathHelper.isEven(row)) {
            if (column < 0 || column >= oddRowLength) {
                return -1;
            }
            offset += evenRowLength;
        } else {
            if (column < 0 || column >= evenRowLength) {
                return -1;
            }
        }

        return common * commonMultiplier + column + offset;
    }

    // Return "false" for left, "true" for right with 50% chance.
    static goRight() {
        return MathHelper.getRandomNumber(0, 2) == 1;
    }

    // Return the minimum needed values to reach an target.
    static getMoveCount(currentRow, currentIndex, targetRow, targetIndex) {

    }
}