class BoundingBox {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  // Obtiene el ancho del bounding box
  get width() {
    return Math.abs(this.x2 - this.x1);
  }

  // Obtiene la altura del bounding box
  get height() {
    return Math.abs(this.y2 - this.y1);
  }

  // Verifica si un punto está dentro del bounding box
  contains(x, y) {
    return (x >= this.x1 && x <= this.x2) && (y >= this.y1 && y <= this.y2);
  }

  hasCollision(otherBBox) {
    return !(this.x2 < otherBBox.x1 || 
             this.x1 > otherBBox.x2 || 
             this.y2 < otherBBox.y1 || 
             this.y1 > otherBBox.y2);
  }

  // Devuelve una representación de string del bounding box
  toString() {
    return `[(${this.x1}, ${this.y1}), (${this.x2}, ${this.y2})]`;
  }
}
