class Snake {
    constructor() {
        this.body = [
            new Cell(12, 12, "#00d4ff"),
            new Cell(12, 13, "#00d4ff"),
            new Cell(12, 14, "#00d4ff")
        ];
        this.direction = "UP";
        this.nextDirection = "UP";
    }

    getHead() {
        return this.body[0];
    }

    move() {
        this.direction = this.nextDirection;
        let head = this.getHead();
        let newHead;

        switch (this.direction) {
            case "UP":
                newHead = new Cell(head.x - 1, head.y, "#00d4ff");
                break;
            case "DOWN":
                newHead = new Cell(head.x + 1, head.y, "#00d4ff");
                break;
            case "LEFT":
                newHead = new Cell(head.x, head.y - 1, "#00d4ff");
                break;
            case "RIGHT":
                newHead = new Cell(head.x, head.y + 1, "#00d4ff");
                break;
        }

        this.body.unshift(newHead);
        this.body.pop();
    }

    grow() {
        let tail = this.body[this.body.length - 1];
        this.body.push(new Cell(tail.x, tail.y, "#00d4ff"));
    }

    changeDirection(newDirection) {
        if (this.direction === "UP" && newDirection !== "DOWN") {
            this.nextDirection = newDirection;
        } else if (this.direction === "DOWN" && newDirection !== "UP") {
            this.nextDirection = newDirection;
        } else if (this.direction === "LEFT" && newDirection !== "RIGHT") {
            this.nextDirection = newDirection;
        } else if (this.direction === "RIGHT" && newDirection !== "LEFT") {
            this.nextDirection = newDirection;
        }
    }

    checkCollision(boardSize) {
        let head = this.getHead();

        // Wall collision
        if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
            return true;
        }

        // Self collision
        for (let i = 1; i < this.body.length; i++) {
            if (head.isEqual(this.body[i])) {
                return true;
            }
        }

        return false;
    }

    getBody() {
        return this.body;
    }
}
