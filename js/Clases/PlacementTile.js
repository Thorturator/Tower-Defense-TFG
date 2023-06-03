//-----------------------------------------------------------------
//-----------------Clase para colocar construcciones---------------
//-----------------------------------------------------------------

class PlacementTile {

	constructor({ position = { x: 0, y: 0 }, width = 32, heigth = 32 }) {
		this.position = position;
		this.width = width;
		this.height = heigth;

		this.boundingBox = new BoundingBox(
			this.position.x,
			this.position.y,
			this.position.x + this.width,
			this.position.y + this.height
		);

		this.color = 'rgba(255, 255, 255, 0.15)';
		this.occupied = false;
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

//-----------------------------------------------------------------
//--Clase para coger la "hitbox" con la casilla correspondiente----
//-----------------------------------------------------------------

	update(mouse, buildings) {
		// this.draw()

		if(mouse.x > this.position.x && mouse.x < this.position.x + this.width &&
			mouse.y > this.position.y && mouse.y < this.position.y + this.height) 
		{
			let existCollision = false;
			let i = 0;
			while (!existCollision && i < buildings.length) {
				existCollision = buildings[i].boundingBox.hasCollision(this.boundingBox);
				i++;
			}

			if (existCollision) {
				this.color = 'red';
			}
			else {
				this.color = 'green';
			}
		}
		else {
			this.color = 'rgba(255, 255, 255, 0.15)';
		}

	}
}