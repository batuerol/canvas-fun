class Fireball {
    constructor(position, radius) {
        this.position = new Vector2(position.x, position.y);
        this.radius = radius;
        this.direction = new Vector2(0, 0);
        this.speed = 0;
        this.color = "rgba(140, 0, 0, 1)";
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }

    drop(path) {
        this.path = path;
        this.targetIndex = path.shift();
        this.target = g_Dots[this.targetIndex];        
        this.speed = 1.5;
        this.bounce = 0;
        this.goToPoint(this.target.center);
    }

    draw(renderer) {
        renderer.fillCircle(this.position, this.radius, this.color);
    }

    update() {
        if (this.bounce > 0) {                   
            --this.bounce;
            if (this.bounce == 0) {
                this.target = null;
            }
        }
        else {
            if (this.target == null) {
                if (this.path.length == 1) {
                    this.target = g_Buckets[this.path.shift()];
                }
                else {
                    this.targetIndex = this.path.shift();
                    this.target = g_Dots[this.targetIndex];
                }
                this.goToPoint(this.target.center);
            }
            else if (this.collidedWith(this.target)) {
                var nextTarget = null;
                if (this.path.length == 1) {
                    nextTarget = g_Buckets[this.path[0]];
                } else {
                    nextTarget = g_Dots[this.path[0]];
                }

                this.bounceTarget = new Vector2(nextTarget.center.x, this.position.y + 5);
                this.goToPoint(this.bounceTarget);
                
                this.bounce = 10;
            }
        }

        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
    }

    collidedWith(object) {
        var nextX = this.position.x + this.direction.x * this.speed;
        var nextY = this.position.y + this.direction.y * this.speed;
        var xDiff = this.position.x - object.center.x;//nextX - object.center.x;//this.position.x - object.center.x;
        var yDiff = this.position.y - object.center.y;//nextY - object.center.y;//this.position.y - object.center.y;
        var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        return distance <= this.radius + object.radius;
    }

    goToPoint(point) {
        var xDiff = this.position.x - point.x;
        var yDiff = this.position.y - point.y;
        var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        this.direction.x = (point.x - this.position.x) / distance;
        this.direction.y = (point.y - this.position.y) / distance;
    }
};