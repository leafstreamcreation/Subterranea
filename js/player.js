class Player extends Actor {
  constructor(controller, speed) {
    super(controller, TYPE_TAGS.PLAYER, ASSET_TAGS.PLAYER, 0, speed);
    this.health = 2;
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
    this.container.objects.forEach((object) => {
      switch (object.type) {
        case TYPE_TAGS.FIRE:
          this.takeDamage(this.controller.bombDamage);
          break;
        case TYPE_TAGS.SINKHOLE:
          this.controller.playerEnteredSinkhole();
          break;
        case TYPE_TAGS.POWERUP:
        case TYPE_TAGS.RESOURCE:
          this.controller.playerPickedUp(object);
          break;
        default:
          break;
      }
    });
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`player health: ${this.health}`);
    this.controller.playerHealthUpdate(this.health);
    if (this.health < 1) this.controller.playerDied();
    //if health === 0 signal the controller that the player died
  }
}
