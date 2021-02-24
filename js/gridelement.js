class GridElement {
    constructor(xPos, yPos, scale) {
        this.gridX = xPos;
        this.gridY = yPos;
        this.x = xPos * scale;
        this.y = yPos * scale;
        this.objects = [];
    }

    adjacentObjects(direction) {
        const objects = [];
        switch (direction) {
            case DIRECTION.UP:
            break;
            case DIRECTION.RIGHT:
            break;
            case DIRECTION.DOWN:
            break;
            case DIRECTION.LEFT:
            break;
            default:
        }
        return objects;
    }
}