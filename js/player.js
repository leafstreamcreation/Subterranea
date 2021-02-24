class Player extends Actor {
  constructor() {
    super(TYPE_TAGS.PLAYER, ASSET_TAGS.PLAYER);
    this.health = 100;
  }
}
