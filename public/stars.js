class star {
  constructor(name, messagesent) {
    this.x = random(windowWidth);
    this.y = random(height);
    this.size = random(3, 6);
    this.message = messagesent;
    this.name = name;
  }
  place() {
    fill(255, 255, 255);
    ellipse(this.x, this.y, random(this.size - random(1, 2), this.size));
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
  getSize() {
    return this.size;
  }
  getMessage() {
    return this.message;
  }
  getName() {
    return this.name;
  }
  setX(newX) {
    if (newX > windowWidth) {
      this.x = 0;
    } else {
      this.x = newX;
    }
  }
}
