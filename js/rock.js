class Rock extends GameObject {
  constructor(controller, assetTag, typeTag, id) {
    super(controller, assetTag, typeTag, id);
    this.blocksActors = true;
  }

  takeDamage(damage) {
    //drop a resource
    this.controller.destroy(this);
  }
}
