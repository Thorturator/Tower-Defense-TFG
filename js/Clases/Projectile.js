//-----------------------------------------------------------------
//------------------Clase del proyectil ---------------------------
//-----------------------------------------------------------------	

	class Projectile extends Sprite{
		constructor({ position = {x: 0, y:0}, enemy}){
			super({
				position, 
				imageSrc: 'img/flame.png'
			})
			this.velocity = {
				x: 0,
				y: 0
			}
			this.enemy = enemy
			this.radius = 3

		}

		update() {
			this.draw()

			const angle = Math.atan2(
				this.enemy.center.y - this.position.y,
				this.enemy.center.x - this.position.x
				)

			this.velocity.x = Math.cos(angle) * 3
			this.velocity.y = Math.sin(angle) * 3

			this.position.x += this.velocity.x
			this.position.y += this.velocity.y
		}
	}