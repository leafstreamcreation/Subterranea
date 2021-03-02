class GameObject {
  constructor(controller, assetTag, typeTag, id) {
    this.container = null;
    this.position = null;
    this.size = null;
    this.asset = assetTag;
    this.type = typeTag;
    this.id = id;
    this.blocksActors = false;
    this.controller = controller;
  }

  newContainer(container) {
    this.container = container;
    this.position = new Position(container.x, container.y);
    this.size = new Size(container.width, container.height);
    this.container.objects.push(this);
  }

  takeDamage(damage) {}

  center() {
    return new Position(
      this.position.x + Math.floor(this.size.width / 2),
      this.position.y + Math.floor(this.size.height / 2)
    );
  }
}
