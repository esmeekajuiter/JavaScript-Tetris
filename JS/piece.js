class Piece {
  x;
  y;
  color;
  shape;
  ctx;
  typeId;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  /**
   * Geeft de informatie van het blokje dat gaat komen.
   */
  spawn() {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
  }

  /**
   * Tekent het blokje dat beweegt. Uit een sprite.
   */
  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.drawImage(image, (25*(value-1)), 0, 24, 24, this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  /**
   * Verander de positie van het blokje.
   */
  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  /**
   * Geeft het beginpunt van het bewegende blokje.
   */
  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  /**
   * Geeft een random blokje terug dat als blokje wordt gebruikt.
   */
  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}