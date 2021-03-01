class Player extends Actor {
  constructor(controller, speed) {
    super(controller, TYPE_TAGS.PLAYER, ASSET_TAGS.PLAYER, 0, speed);
    this.health = 1;
  }

  checkForCollisions() {
    this.blocked.horizontal = MOVEMENT.NONE;
    this.blocked.vertical = MOVEMENT.NONE;
    this.nearbyObjects.forEach((object) => {
      if (this.collidesWith(object)) {
        console.log(`${this.type} collided with ${object.type}`);
        if (object.blocksActors) this.updateBlockedState(object);
      } else if (object.type === TYPE_TAGS.BOMB) object.blocksActors = true;
    });
  }

  transitionToNewContainer(container) {
    super.transitionToNewContainer(container);
    if (this.container.contains(TYPE_TAGS.FIRE)) this.takeDamage(1);
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`player health: ${this.health}`);
    //if health === 0 signal the controller that the player died
  }
}
