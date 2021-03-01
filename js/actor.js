class Actor extends GameObject {
  constructor(controller, assetTag, typeTag, id, speed) {
    super(controller, assetTag, typeTag, id);
    this.moveState = {
      vertical: MOVEMENT.NONE,
      horizontal: MOVEMENT.NONE,
    };
    this.speed = speed;
    this.nearbyObjects = [];
    this.exitingFrom = null;
    this.blocked = {
      vertical: MOVEMENT.NONE,
      horizontal: MOVEMENT.NONE,
    };
  }

  move(bound) {
    if (
      !(
        this.moveState.vertical === MOVEMENT.NONE &&
        this.moveState.horizontal === MOVEMENT.NONE
      )
    ) {
      if (
        this.blocked.horizontal === MOVEMENT.NONE ||
        this.blocked.horizontal !== this.moveState.horizontal
      )
        this.position.x += this.moveState.horizontal * this.speed;
      if (
        this.blocked.vertical === MOVEMENT.NONE ||
        this.blocked.vertical !== this.moveState.vertical
      )
        this.position.y += this.moveState.vertical * this.speed;
      this.confineToGameBoard(bound);

      this.checkForCollisions();

      this.exitingFrom = this.container.isInBounds(this);
      if (this.exitingFrom !== DIRECTION.NONE) this.transitionToNewContainer();
    }
  }

  refreshNearbyObjects() {
    this.nearbyObjects = this.container.nearbyObjects();
    // console.log(
    //   `${this.type} nearby objects: (${
    //     this.nearbyObjects.length
    //   }) ${this.nearbyObjects.map((e) => e.type)}`
    // );
  }

  checkForCollisions() {
    this.blocked.horizontal = MOVEMENT.NONE;
    this.blocked.vertical = MOVEMENT.NONE;
    this.nearbyObjects.forEach((object) => {
      if (this.collidesWith(object)) {
        console.log(`${this.type} collided with ${object.type}`);
        if (object.blocksActors) this.updateBlockedState(object);
      }
    });
  }

  transitionToNewContainer() {
    this.container.remove(this);
    this.newContainer(this.container.nextContainer(this.exitingFrom));
  }

  confineToGameBoard(bound) {
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x + this.size.width > bound)
      this.position.x = bound - this.size.width;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y + this.size.height > bound)
      this.position.y = bound - this.size.height;
  }

  newContainer(container) {
    this.container = container;
    this.nearbyObjects = container.nearbyObjects();
    this.exitingFrom = DIRECTION.NONE;
    this.container.objects.push(this);
    // console.log(
    //   `${this.type} entered container ${container.gridX},${container.gridY}`
    // );
    // console.log(
    //   `${this.type} nearby objects: (${
    //     this.nearbyObjects.length
    //   }) ${this.nearbyObjects.map((e) => e.type)}`
    // );
  }

  snapToGrid() {
    this.position = new Position(this.container.x, this.container.y);
    this.size = new Size(this.container.width, this.container.height);
  }

  collidesWith(gameObject) {
    if (gameObject === null) return false;
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

  updateBlockedState(gameObject) {
    const dx = gameObject.center().x - this.center().x;
    const dy = gameObject.center().y - this.center().y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        this.blocked.horizontal = MOVEMENT.RIGHT;
        this.position.x = gameObject.position.x - this.size.width;
      } else {
        this.blocked.horizontal = MOVEMENT.LEFT;
        this.position.x = gameObject.position.x + gameObject.size.width;
      }
    } else {
      if (dy > 0) {
        this.blocked.vertical = MOVEMENT.DOWN;
        this.position.y = gameObject.position.y - this.size.height;
      } else {
        this.blocked.vertical = MOVEMENT.UP;
        this.position.y = gameObject.position.y + gameObject.size.height;
      }
    }
  }
}
