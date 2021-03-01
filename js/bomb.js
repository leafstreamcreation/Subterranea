class Bomb extends Actor {
  constructor(controller, assetTag, typeTag, id, speed, power, damage) {
    super(controller, assetTag, typeTag, id, speed);
    this.power = power;
    this.placed = false;
    this.damage = damage;
    this.fuse = null;
  }

  newContainer(container) {
    super.newContainer(container);
    if (!this.placed) {
      this.fuse = setTimeout(() => this.detonate(false), 3000);
      this.placed = true;
    }
  }

  takeDamage(damage) {
    this.detonate(true);
  }

  detonate(early) {
    // console.log(`BOOM`);
    if (early) clearTimeout(this.fuse);
    const aoe = this.areaOfEffect();
    this.controller.spawnObject(
      FireEffect,
      [this.controller, ASSET_TAGS.FIRE, TYPE_TAGS.FIRE, 0],
      aoe
    );
    this.container.remove(this);
    aoe.forEach((container) => {
      container.objects.forEach((object) => {
        console.log(`${object.type} took damage`);
        object.takeDamage(this.damage);
      });
    });
    this.controller.destroy(this);
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
