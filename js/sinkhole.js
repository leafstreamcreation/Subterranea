class SinkHole extends GameObject {
  constructor(controller) {
    super(controller, ASSET_TAGS.SINKHOLE, TYPE_TAGS.SINKHOLE, 0);
  }

  transitionToNewContainer(container) {
    this.container.remove(this);
    this.newContainer(container);
  }
}
