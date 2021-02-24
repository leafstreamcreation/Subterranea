class Actor extends GameObject {
  constructor(assetTag, typeTag) {
    super(assetTag, typeTag);
  }

  move(dx, dy, bound) {
    this.position.x += dx;
    this.position.y += dy;
    if (this.position.x < 0) this.position.x = 0;
    else if (this.position.x + this.size.width > bound) this.position.x = bound - this.size.width;
    if (this.position.y < 0) this.position.y = 0;
    else if (this.position.y + this.size.height > bound) this.position.y = bound - this.size.height;
  }

  collidesWith(gameObject) {
    if (
      this.position.x < gameObject.position.x + gameObject.size.width &&
      this.position.x + this.size.width > gameObject.position.x &&
      this.position.y < gameObject.position.y + gameObject.size.height &&
      this.position.y + this.size.height > gameObject.position.y
    ) {
      return true;
    }
    return false;
  }
}
