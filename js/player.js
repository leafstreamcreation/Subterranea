class Player extends Actor {
  constructor(speed) {
    super(TYPE_TAGS.PLAYER, ASSET_TAGS.PLAYER, speed);
    this.health = 100;
  }
}
