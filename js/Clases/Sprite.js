class Sprite{
	constructor({
		position = {x: 0, y:0}, 
		imageSrc, 
		frames = {max: 1}, 
		offset = {x:0, y:0} 
	})	{
		this.position = position
		this.image = new Image()
		this.image.src = imageSrc;
		this.frames = {
			max: frames.max,
			current: 0,
			elapsed: 0,
			hold: 5
		}

		this.offset = offset 

	// Ajusta las dimensiones de la imagen
	this.image.onload = () =>{
    	this.imageWidth = 50; // Ancho deseado de la imagen
    	this.imageHeight = 50; // Alto deseado de la imagen
	}
}
	draw() {
		const cropWidth = this.image.width / this.frames.max
		const crop = {
			position: {
				x: cropWidth * this.frames.current,
				y: 0
			},
			width: cropWidth,
			height: this.image.height
		}
		c.drawImage(this.image, 
			crop.position.x, 
			crop.position.y, 
			crop.width, 
			crop.height, 
			this.position.x - (this.image.width/2) + this.offset.x,
			this.position.y - (this.image.height/2) + this.offset.y,
			this.imageWidth,
			this.imageHeight
		)
	}
	//  Control de animación
	update(){
		this.frames.elapsed++
		if (this.frames.elapsed % this.frames.hold === 0){
			this.frames.current++
			if(this.frames.current >=this.frames.max){
				this.frames.current = 0
			}
	}
}
}