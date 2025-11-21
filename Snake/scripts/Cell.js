class Cell {
    constructor(x, y, color = "") {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    isEqual(cell) {
        return this.x === cell.x && this.y === cell.y;
    }
}
