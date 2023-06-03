
//-----------------------------------------------------------------
//------------------Clase de la construcción-----------------------
//-----------------------------------------------------------------	

	class Building { // extends Sprite {
		constructor ({ 
			position = { x: 0, y: 0 },
			offset = { x: 0, y: 0}
		}) {

			this.width = 100;
	    this.height = 100;

			this.position = { // OJO, usamos position y no this.position. usamos el que viene por parametro en el consutrctor
				x: position.x - this.width / 2,
				y: position.y - this.height / 2,
				center: {
					x: position.x,
	      	y: position.y
				}
			};

			this.boundingBox = new BoundingBox(
				this.position.x,
				this.position.y,
				this.position.x + this.width,
				this.position.y + this.height
			);

	    this.image = new Image();
	    this.image.src = 'img/tower.png';
	    this.frames = {
	      max: 11,
	      current: 0,
	      elapsed: 0,
	      hold: 5,
	    };

	    this.projectiles = [];
			this.radius = 125;
			this.target = null;
		}

		draw() {	
	    // Dibujar el sprite correspondiente al frame actual
			// TODO: Sacar a algo base tipo sprite
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
			
			// dibujar el circulo de expansion
			c.beginPath();
			c.arc(this.position.center.x, this.position.center.y, this.radius, 0, Math.PI * 2);
			c.fillStyle = 'rgba(0, 0, 255, 0.2)';
			c.fill();
		}
		
		update() {
	    this.frames.elapsed++;
	    if (this.frames.elapsed % this.frames.hold === 0) {
	      this.frames.current++;
	      if (this.frames.current >= this.frames.max) {
	        this.frames.current = 0;
	      }
	    }

			if (this.target && 
				this.frames.current === 4 && 
				this.frames.elapsed % this.frames.hold === 0
			) {
				this.shoot();
			}
		}

		shoot() {
			this.projectiles.push(
				new Projectile({
					position: {
						x: this.position.center.x - 25,
						y: this.position.center.y - 50 // TODO: Este 50 reemplazar por el alto del projectile
					},
					enemy: this.target
				})
			);
		}
	}