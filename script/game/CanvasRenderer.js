class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.observers = [];
    }

    // Simple draw queue using zIndex. Smaller z-index means early draw.
    // If elements have same z-index value then they'll be drawn in order.
    subscribe(_object, _zIndex) {
        this.observers.push({ object: _object, zIndex: _zIndex });
        // NOTE(batuhan): This is inefficient but it will be called once for each
        // subscribtion.  
        this.observers.sort(this.zIndexSort);
    }

    zIndexSort(a, b) {
        if (a.zIndex < b.zIndex) {
            return -1;
        }
        if (a.zIndex > b.zIndex) {
            return 1;
        }

        return 0;
    }

    // Find and delete object from draw queue.
    unsubscribe(object) {
        var index = this.observers.indexOf(object);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }
    
    // Draw objects in order. Don't need to check z-index since they're sorted.
    draw(context) {
        if (context != null) {
            this.context = context;
        }

        var renderer = this;
        this.observers.forEach(function (e) {
            e.object.draw(renderer);
        });
    }

    // Context drawing functions
    _drawArc(center, radius) {
        this.context.arc(center.x, center.y, radius, 0, Math.PI * 2, false);
    }

    strokeCircle(center, radius, color) {
        this.context.beginPath();
        this._drawArc(center, radius);
        this.stroke(color);
        this.context.closePath();
    }

    fillCircle(center, radius, strokeColor) {
        this.context.beginPath();
        this._drawArc(center, radius);
        this.fill(strokeColor);
        this.context.closePath();
    }

    _drawRect(position, width, height) {
        this.context.rect(position.x, position.y, width, height);
    }

    strokeRectangle(position, width, height, color) {
        this.context.beginPath();
        this._drawRect(position, width, height);
        this.stroke(color);
        this.context.closePath();
    }

    fillRectangle(position, width, height, color) {
        this.context.beginPath();
        this._drawRect(position, width, height);
        this.fill(color);
        this.context.closePath();
    }

    drawLine(start, end, color) {
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.stroke(color);
        this.context.closePath();
    }

    drawImage(texture, texturePositionX, texturePositionY,
        width, height) {
        this.context.drawImage(texture, texturePositionX, texturePositionY,
            width, height);
    }
    
    putText(position, text, color, center) {
        this.context.font = this.font;
        var finalPos = position;
        if (center) {
            finalPos = this._centerText(position, text);
        }

        this.context.fillStyle = color;
        this.context.fillText(text, finalPos.x, finalPos.y);
    }

    outlineText(position, text, color, center) {
        this.context.font = this.font;
        var finalPos = position;
        if (center) {
            finalPos = this._centerText(position, text);
        }

        this.context.strokeStyle = color;
        this.context.strokeText(text, finalPos.x, finalPos.y);
    }

    _centerText(position, text) {
        // NOTE(batuhan): Canvas doesn't provide any methods to figure out font height...
        // TODO(batuhan): Find a way to measure font height.
        var _text = text + "";
        var textWidth = this.context.measureText(text).width;
        var textHeight = textWidth / _text.length;        
        return new Vector2(position.x - textWidth * 0.5, position.y + textHeight * 0.5);
    }

    fill(color) {
        this.context.fillStyle = color;
        this.context.fill();
    }

    stroke(color) {
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    color(strokeColor, fillColor) {
        this.stroke(strokeColor);
        this.fill(fillColor);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // End of context drawing functions.    
}