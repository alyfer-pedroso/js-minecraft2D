class Player {
  constructor(x, y) {
    this.width = 39;
    this.height = 160;
    this.mouseY = 0;
    this.mouseX = 0;
    this.arm = {
      x: 8.5,
      y: 40,
      w: 21,
      h: 63,
      angle: 0,
    };
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
      mouseLeft: {
        click: false,
      },
    };
    this.speed = 2;
    this.runningSpeed = this.speed * 2;
    this.running = false;
  }

  draw() {
    // Desenhar o corpo do jogador
    if (!this.invert) {
      createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, steve_no_armsImg);
    } else {
      createRect(this.position.x, this.position.y, this.width, this.height, "image", 0, 0, 0, 0, steve_no_armsImg, this.invert);
    }
  }

  groundCollision() {
    grounds.forEach((ground) => {
      if (
        (this.position.y + this.height + this.velocity.y <= ground.position.y && !ground.broken) ||
        (this.position.y + this.height + this.velocity.y <= ground.position.y && ground.broken) ||
        (this.position.y + this.velocity.y >= ground.position.y + ground.height && ground.broken) ||
        (this.position.y + this.velocity.y >= ground.position.y + ground.height && !ground.broken) ||
        (this.position.y + this.velocity.y == ground.position.y + ground.height && ground.broken) ||
        (this.position.y + this.height + this.velocity.y == ground.position.y && ground.broken)
      ) {
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

  armDraw() {
    canvasContext.save();
    let armRotationX = this.position.x + this.arm.x + this.arm.w / 2;
    let armRotationY = this.position.y + this.arm.y;

    // Rotacionar o contexto para que a parte inferior do braço aponte para o mouse
    canvasContext.translate(armRotationX, armRotationY);
    canvasContext.rotate(this.angle);
    canvasContext.translate(-armRotationX, -armRotationY);

    // Desenhar o braço do jogador
    canvasContext.drawImage(steve_armImg, this.position.x + this.arm.x, this.position.y + this.arm.y, this.arm.w, this.arm.h);
    canvasContext.restore();
  }

  armController(e) {
    let canvasBoundingRect = canvas.getBoundingClientRect();
    this.mouseX = e.clientX - canvasBoundingRect.left;
    this.mouseY = e.clientY - canvasBoundingRect.top;

    // Calcular o ângulo entre o braço e o mouse
    let dx = this.mouseX - (this.position.x + this.arm.x); // Inverter dx
    let dy = this.mouseY - (this.position.y + this.arm.y); // Inverter dy
    this.angle = Math.atan2(dy, dx) - Math.PI / 2; // Subtrair 90 graus

    this.armDraw();

    grounds.forEach((ground) => {
      if (
        this.mouseX >= ground.position.x &&
        this.mouseX <= ground.position.x + blockSize &&
        this.mouseY >= ground.position.y &&
        this.mouseY <= ground.height + ground.position.y &&
        ground.type == "front"
      ) {
        ground.isSelected = true;
      } else {
        ground.isSelected = false;
      }
    });
  }

  breakBlock() {
    if (this.keys.mouseLeft.click) {
      this.keys.mouseLeft.click = false;
      grounds.forEach((ground) => {
        if (ground.isSelected) {
          ground.onBroken();
        }
      });
    }
  }

  start() {
    addEventListener("keydown", (e) => {
      let key = e.key.toLowerCase();
      switch (key) {
        case "a":
          this.keys.left.pressed = true;
          this.keys.right.pressed = false;
          this.invert = true;
          break;

        case "d":
          this.keys.right.pressed = true;
          this.keys.left.pressed = false;
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

    addEventListener("mousedown", (e) => {
      let btn = e.button;

      switch (btn) {
        case 0:
          this.keys.mouseLeft.click = true;
          this.breakBlock();
          break;

        default:
          break;
      }
    });
    addEventListener("mouseup", (e) => {
      let btn = e.button;

      switch (btn) {
        case 0:
          this.keys.mouseLeft.click = false;
          break;

        default:
          break;
      }
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
          scroller += speed;
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
          scroller -= speed;
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
    this.armDraw();
  }
}
