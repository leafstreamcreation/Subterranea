class Bomb extends Actor {
  constructor(
    controller,
    assetTag,
    typeTag,
    id,
    speed,
    power,
    damage,
    fuseTime
  ) {
    super(controller, assetTag, typeTag, id, speed);
    this.power = power;
    this.placed = false;
    this.damage = damage;
    this.fuse = null;
    this.fuseTime = fuseTime;
  }

  newContainer(container) {
    super.newContainer(container);
    if (!this.placed) {
      this.fuse = setTimeout(() => this.detonate(false), this.fuseTime);
      this.placed = true;
    }
  }

  takeDamage(damage) {
    this.detonate(true);
  }

  detonate(early) {
    // console.log(`BOOM`);
    if (early) clearTimeout(this.fuse);
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
