class Actor extends GameObject {
  constructor(assetTag, typeTag, speed) {
    super(assetTag, typeTag);
    this.moveState = {
      vertical: MOVEMENT.NONE,
      horizontal: MOVEMENT.NONE,
    };
    this.speed = speed;
    this.nearbyObjects = [];
    this.outOfBounds = null;
  }

  move(bound) {
    this.position.x += this.moveState.horizontal * this.speed;
    this.position.y += this.moveState.vertical * this.speed;
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x + this.size.width > bound)
      this.position.x = bound - this.size.width;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y + this.size.height > bound)
      this.position.y = bound - this.size.height;

    this.outOfBounds = this.container.outOfBounds(this);
    if (this.outOfBounds !== DIRECTION.NONE)
      this.newContainer(this.container.nextContainer(this.outOfBounds));
  }

  newContainer(container) {
    if (this.container !== null) this.container.remove(this);
    this.container = container;
    this.nearbyObjects = container.nearbyObjects();
    this.outOfBounds = DIRECTION.NONE;
    console.log(
      `${this.type} entered container ${container.gridX},${container.gridY}`
    );
    console.log(
      `nearby objects: (${this.nearbyObjects.length}) ${this.nearbyObjects.map(
        (e) => e.type
      )}`
    );
  }

  snapToGrid() {
    this.position = new Position(this.container.x, this.container.y);
    this.size = new Size(this.container.width, this.container.height);
  }

  collidesWith(gameObject) {
    if (
      this.position.x < gameObject.position.x + gameObject.size.width &&
      this.position.x + this.size.width > gameObject.position.x &&
      this.position.y < gameObject.position.y + gameObject.size.height &&
      this.position.y + this.size.height > gameObject.position.y
    ) {
      return true;
    }
    return false;
  }
}
