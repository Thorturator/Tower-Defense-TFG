//-----------------------------------------------------------------
//------------------Clase del enemigo------------------------------
//-----------------------------------------------------------------


class Enemy {
  constructor({ position = { x: 0, y: 0 }, speed = 1}) {
    this.position = position;
    this.image = new Image();
    this.image.src = 'img/knight.png';
    this.frames = {
      max: 8,
      current: 0,
      elapsed: 0,
      hold: 5,
    };
    this.width = 50;
    this.height = 50;
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.radius = 25;
    this.health = 100;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = speed;
  }

  // Determinar el índice de sprite basado en la dirección del enemigo
  getSpriteIndex() {
    const waypointOrder = ['down', 'right', 'up', 'right', 'down', 'left', 'down', 'right', 'up', 'right'];
    const currentDirection = waypointOrder[this.waypointIndex % waypointOrder.length];
    let spriteIndex = 0;

    switch (currentDirection) {
      case 'down':
        spriteIndex = 0; // Sprite mirando hacia abajo
        break;
      case 'right':
        spriteIndex = 2; // Sprite mirando hacia la derecha
        break;
      case 'up':
        spriteIndex = 4; // Sprite mirando hacia arriba
        break;
      case 'left':
        spriteIndex = 6; // Sprite mirando hacia la izquierda
        break;
      default:
        spriteIndex = 0; // Sprite mirando hacia abajo por defecto
        break;
    }

    return spriteIndex;
  }

  // Dibujar el enemigo en el lienzo de dibujo
  draw() {
    const spriteIndex = this.getSpriteIndex();

    // Ajustar la animación de los frames
    this.frames.current = spriteIndex;
    this.frames.elapsed++;

    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current++;
      if (this.frames.current >= this.frames.max) {
        this.frames.current = 0;
      }
    }

    // Dibujar el sprite correspondiente al frame actual
    const cropWidth = this.image.width / this.frames.max;
    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      width: cropWidth,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // Dibujar la barra de salud
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y - 15, this.width, 10);

    c.fillStyle = 'green';
    c.fillRect(
      this.position.x,
      this.position.y - 15,
      (this.width * this.health) / 100,
      10
    );
  }

  // Actualizar la posición y el movimiento del enemigo
  update() {
    //this.draw();

    const waypoint = waypoints[this.waypointIndex];

    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;

    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}

