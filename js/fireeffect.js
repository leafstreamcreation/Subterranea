class FireEffect extends GameObject {
  constructor(controller, asset, type, id) {
    super(controller, asset, type, id);
  }

  newContainer(container) {
    super.newContainer(container);
    setTimeout(() => this.controller.destroy(this), 96);
  }
}
