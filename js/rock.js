class Rock extends GameObject {
  constructor(controller, assetTag, typeTag, id) {
    super(controller, assetTag, typeTag, id);
    this.blocksActors = true;
  }

  takeDamage(damage) {
    this.controller.destroy(this);
    switch (Math.floor(10 * Math.random())) {
      case 0:
        this.controller.spawnObject(
          GunPowder,
          [this.controller, ASSET_TAGS.GUNPOWDER, TYPE_TAGS.POWERUP, 0],
          [this.container]
        );
        break;
      case 1:
        this.controller.spawnObject(
          GameObject,
          [this.controller, ASSET_TAGS.UNOBTAINIUM, TYPE_TAGS.RESOURCE, 0],
          [this.container]
        );
        break;
      default:
        break;
    }
  }
}
