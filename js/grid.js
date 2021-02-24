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

  containerAbove(container) {
    if (container === null) return container;
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
}

//TODO: Finish Grid and utilize it in subterraneagameviewcontroller
