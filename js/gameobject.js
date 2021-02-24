class GameObject {
  constructor(assetTag, typeTag) {
    this.container = null;
    this.position = null;
    this.size = null;
    this.asset = assetTag;
    this.type = typeTag;
  }

  newContainer(container) {
    this.container = container;
    this.position = new Position(container.x, container.y);
    this.size = new Size(container.width, container.height);
  }

  center() {
    return new Position(
      this.position.x + Math.floor(this.size.width / 2),
      this.position.y + Math.floor(this.size.height / 2)
    );
  }
}
