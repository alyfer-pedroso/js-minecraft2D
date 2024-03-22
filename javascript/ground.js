class Ground {
  constructor(x, y, type) {
    this.width = blockSize;
    this.height = blockSize;
    this.type = type;
    this.broken = false;
    this.isSelected = false;
    this.audio = new Audio("../assets/sounds/grassBreak.mp3");
    this.position = {
      x: x,
      y: y,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, grassImg);
  }

  drawBack() {
    createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, this.broken ? dirtImg : grassImg);
    createRect(this.position.x, this.position.y, this.width, this.height, "rect", this.broken ? "#0000007f" : "#0000004f", 0, 0, 0);
  }

  selected() {
    createRect(this.position.x, this.position.y, this.width, this.height, "rect", "#ffffff4f", 0, 0, 0);
  }

  onBroken() {
    if (!this.broken) {
      this.broken = true;
      this.audio.play();
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.type === "back" ? this.drawBack() : this.broken ? this.drawBack() : this.draw();
    this.isSelected && !this.broken && this.selected();
  }
}
