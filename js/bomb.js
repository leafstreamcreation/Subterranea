class Bomb extends Actor {
  constructor(controller, assetTag, typeTag, id, speed, power) {
    super(controller, assetTag, typeTag, id, speed);
    this.power = power;
    this.placed = false;
  }

  newContainer(container) {
    super.newContainer(container);
    if (!this.placed) {
      setTimeout(() => this.detonate(), 3000);
      this.placed = true;
    }
  }

  detonate() {
    console.log(`BOOM`);
    this.controller.destroy(this);
  }
}
