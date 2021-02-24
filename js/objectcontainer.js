class ObjectContainer {
  constructor(xPos, yPos, scale, grid) {
    this.gridX = xPos;
    this.gridY = yPos;
    this.x = xPos * scale;
    this.y = yPos * scale;
    this.width = scale;
    this.height = scale;
    this.objects = [];
    this.grid = grid;
  }

  nearbyObjects() {
    return this.grid
      .adjacentContainers(this)
      .reduce(
        (objects, container) => (objects = objects.concat(container.objects)),
        []
      );
  }

  remove(object) {
    if (this.objects.includes(object)) {
      this.objects.splice(this.objects.indexOf(object), 1);
      return true;
    }
    return false;
  }

  outOfBounds(object) {
    if (object.center().x < this.x) return DIRECTION.LEFT;
    else if (object.center().x > this.x + this.width) return DIRECTION.RIGHT;
    else if (object.center().y < this.y) return DIRECTION.UP;
    else if (object.center().y > this.y + this.height) return DIRECTION.DOWN;
    return DIRECTION.NONE;
  }

  nextContainer(direction) {
    switch (direction) {
      case DIRECTION.UP:
        return this.grid.containerAbove(this);
      case DIRECTION.DOWN:
        return this.grid.containerBelow(this);
      case DIRECTION.LEFT:
        return this.grid.containerLeftOf(this);
      case DIRECTION.RIGHT:
        return this.grid.containerRightOf(this);
      default:
        return this;
    }
  }
}
