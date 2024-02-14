const gravity = 1;
let speed;
let scroller = 0;

//Player
class Player {
  constructor(x, y) {
    this.width = 39;
    this.height = 160;
    this.canFall = true;
    this.invert = false;
    this.lastpos = 0;
    this.position = {
      x: x,
      y: y,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.keys = {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
      jump: {
        pressed: false,
      },
    };
    this.speed = 2;
    this.runningSpeed = this.speed * 2;
    this.running = false;
  }

  draw() {
    if (!this.invert) {
      createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, steveImg);
    } else {
      createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, steveImg, this.invert);
    }
  }

  groundCollision() {
    grounds.forEach((ground) => {
      if (this.position.y + this.height + this.velocity.y <= ground.position.y) {
        this.canFall = true;
      } else {
        this.canFall = false;
      }
    });

    if (this.canFall) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }

  start() {
    addEventListener("keydown", (e) => {
      let key = e.key.toLowerCase();
      switch (key) {
        case "a":
          this.keys.left.pressed = true;
          this.invert = true;
          break;

        case "d":
          this.keys.right.pressed = true;
          this.invert = false;
          break;
      }

      if (key === "shift") {
        if (this.keys.left.pressed || this.keys.right.pressed) this.running = true;
      }

      if (key === " ") this.jump();
    });
    addEventListener("keyup", (e) => {
      let key = e.key.toLowerCase();
      switch (key) {
        case "a":
          this.keys.left.pressed = false;
          break;
        case "d":
          this.keys.right.pressed = false;
          break;
      }

      if (key === "shift") {
        if (this.keys.left.pressed || this.keys.right.pressed) this.running = false;
      }
      if (key === " ") this.keys.jump.pressed = false;
    });
  }

  moveX() {
    if (scroller <= 0) scroller = 0;

    if (this.keys.right.pressed) {
      if (this.position.x <= 700) {
        this.velocity.x = speed;
        grounds.forEach((ground) => {
          ground.velocity.x = 0;
        });
      } else {
        if (scroller < grounds[grounds.length - 1].position.x + grounds[grounds.length - 1].width) {
          scroller++;
          this.velocity.x = 0;
          grounds.forEach((ground) => {
            ground.velocity.x = -speed;
          });
        } else {
          this.velocity.x = speed;
          grounds.forEach((ground) => {
            ground.velocity.x = 0;
          });
        }
      }
    } else if (this.keys.left.pressed) {
      if (this.position.x + this.width >= 300) {
        this.velocity.x = -speed;
        grounds.forEach((ground) => {
          ground.velocity.x = 0;
        });
      } else {
        if (scroller > 0) {
          scroller--;
          this.velocity.x = 0;
          grounds.forEach((ground) => {
            ground.velocity.x = speed;
          });
        } else {
          this.velocity.x = -speed;
          grounds.forEach((ground) => {
            ground.velocity.x = 0;
          });
        }
      }
    } else {
      this.velocity.x = 0;
      grounds.forEach((ground) => {
        ground.velocity.x = 0;
      });
    }

    if (this.position.x <= 0) this.position.x = this.lastpos;
    this.lastpos = this.position.x;
  }

  jump() {
    if (!this.canFall && !this.keys.jump.pressed) {
      this.velocity.y = -this.height / 10;
      this.keys.jump.pressed = true;
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.groundCollision();
    this.moveX();
    this.draw();
  }
}

//Chao
class Ground {
  constructor(x, y) {
    this.width = blockSize;
    this.height = blockSize;
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

  update() {
    this.position.x += this.velocity.x;
    this.draw();
  }
}
