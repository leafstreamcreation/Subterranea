class GunPowder extends GameObject {
  constructor(cotroller, assetTag, tyeTag, id) {
    super(cotroller, assetTag, tyeTag, id);
    this.damage = 1;
    this.power = 1;
  }

  takeDamage(damage) {
    this.detonate();
  }

  detonate() {
    this.controller.destroy(this);
    const aoe = this.areaOfEffect();
    aoe.forEach((container) => {
      container.objects.forEach((object) => {
        // console.log(`${object.type} took damage`);
        object.takeDamage(this.damage);
      });
    });
    this.controller.spawnObject(
      FireEffect,
      [this.controller, ASSET_TAGS.FIRE, TYPE_TAGS.FIRE, 0],
      aoe
    );
  }

  areaOfEffect() {
    const aoe = [this.container];
    aoe.push(
      ...this.container.containersUpToFirstObject(
        TYPE_TAGS.ROCK,
        DIRECTION.UP,
        this.power,
        true
      )
    );
    aoe.push(
      ...this.container.containersUpToFirstObject(
        TYPE_TAGS.ROCK,
        DIRECTION.RIGHT,
        this.power,
        true
      )
    );
    aoe.push(
      ...this.container.containersUpToFirstObject(
        TYPE_TAGS.ROCK,
        DIRECTION.LEFT,
        this.power,
        true
      )
    );
    aoe.push(
      ...this.container.containersUpToFirstObject(
        TYPE_TAGS.ROCK,
        DIRECTION.DOWN,
        this.power,
        true
      )
    );
    return aoe;
  }
}
