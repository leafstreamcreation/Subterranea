class Grid {
  constructor(width, size) {
    this.container = [];
    this.size = size;
    const gridElementScale = Math.floor(width / size);
    for (let i = 0; i < size; i++) {
      this.container.push([]);
      for (let j = 0; j < size; j++) {
        this.container[i].push(
          new ObjectContainer(j, i, gridElementScale, this)
        );
      }
    }
  }

  adjacentContainers(container) {
    const containers = [];
    containers.push(this.containerAbove(container));
    containers.push(this.containerAbove(this.containerRightOf(container)));
    containers.push(this.containerRightOf(container));
    containers.push(this.containerBelow(this.containerRightOf(container)));
    containers.push(this.containerBelow(container));
    containers.push(this.containerBelow(this.containerLeftOf(container)));
    containers.push(this.containerLeftOf(container));
    containers.push(this.containerAbove(this.containerLeftOf(container)));
    return containers.filter((e) => e !== null);
  }

  containersInDirection(container, direction, limit) {
    switch (direction) {
      case DIRECTION.UP:
        return this.containers(container, (c) => this.containerAbove(c), limit);
      case DIRECTION.DOWN:
        return this.containers(container, (c) => this.containerBelow(c), limit);
      case DIRECTION.LEFT:
        return this.containers(
          container,
          (c) => this.containerLeftOf(c),
          limit
        );
      case DIRECTION.RIGHT:
        return this.containers(
          container,
          (c) => this.containerRightOf(c),
          limit
        );
      default:
    }
    return containers;
  }

  containers(container, nextContainerFunction, quantity) {
    const containers = [];
    let nextContainer = nextContainerFunction(container);
    for (let i = 0; i < quantity; i++) {
      if (nextContainer === null) break;
      containers.push(nextContainer);
      nextContainer = nextContainerFunction(nextContainer);
    }
    return containers;
  }

  containerAbove(container) {
    if (container === null) return null;
    return container.gridY === 0
      ? null
      : this.container[container.gridY - 1][container.gridX];
  }
  containerBelow(container) {
    if (container === null) return container;
    return container.gridY === this.size - 1
      ? null
      : this.container[container.gridY + 1][container.gridX];
  }
  containerLeftOf(container) {
    if (container === null) return container;
    return container.gridX === 0
      ? null
      : this.container[container.gridY][container.gridX - 1];
  }
  containerRightOf(container) {
    if (container === null) return container;
    return container.gridX === this.size - 1
      ? null
      : this.container[container.gridY][container.gridX + 1];
  }

  hasObject(typeTag) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.container[y][x].contains(typeTag)) return true;
      }
    }
    return false;
  }
}
