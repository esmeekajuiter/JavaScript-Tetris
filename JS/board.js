class Board {
  ctx; 
  ctxNext; 
  grid;
  piece;
  next;
  requestId;
  time;

  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  /** 
   * Berekent de grote van het canvas doormiddel van de constants en
   * schaalt het zodat je niet elke keer als draw wordt uitgevoerd de grote mee hoeft te geven. 
  */
  init() {
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  /**
   * Maakt de grid leeg, pakt het nieuwe blokje en returned waar het blokje moet beginnen.
   */
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  /**
   * Pakt het blokje wat na het bewegende blokje word gebruikt als nieuw bewegend blokje.
   */
  getNewPiece() {
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(
      0,
      0, 
      this.ctxNext.canvas.width, 
      this.ctxNext.canvas.height
    );
    this.next.draw();
  }

  /**
   * Teken de blokjes. 
   */
  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  /**
   * Als er plek is, beweeg het blokje.
   * Anders zet je het blokje vast en kijk je of de lijn vol is.
   * Als het blokje in de hoogte niet meer geplaatst kan worden, game over.
   */
  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  /**
   * Als elke value groter is dan 0, dus de horizontale lijn is vol,
   * check hoeveel lijnen dat er weg zijn gehaald en haal die rijen weg.
   * Voeg dan aan de bovenkant een lege rij toe, zodat het speelveld "gevuld" blijft.
   * Als je het aantal lijnen hebt gehaald voor dit level, ga je naar het volgende level.
   * Bij het volgende level wordt de game sneller gemaakt.
   */
  clearLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {

      if (row.every(value => value > 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });
    
    if (lines > 0) {
      account.score += this.getLinesClearedPoints(lines);
      account.lines += lines;

      if (account.lines >= LINES_PER_LEVEL) {
        account.level++;  
        account.lines -= LINES_PER_LEVEL;
        time.level = LEVEL[account.level];
      }
    }
  }

  /**
   * Kijkt waar er nog plek is op het bord.
   */
  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 ||
          (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
        );
      });
    });
  }

  /**
   * Als het blokje wordt geplaatst, zet hem vast.
   */
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  /**
   * Teken het blokje als hij op het bord verschijnt. De blokjes worden uit een sprite gehaalt.
   */
  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.drawImage(image, (25*(value-1)), 0, 24, 24, x, y, 1, 1);
        }
      });
    });
  }

  /**
   * Leegt de grid gebaseerd op de constanten.
   */
  getEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  /**
   * Laat het programma weten dat de blokjes binnen het speelveld zijn
   */
  insideWalls(x) {
    return x >= 0 && x < COLS;
  }

  /**
   * Laat het programma weten dat de blokjes binnen het speelveld zijn
   */
  aboveFloor(y) {
    return y <= ROWS;
  }

  /**
   * Checked of er plek is.
   */
  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  /**
   * Roteerd het geselecteerde blokje met de klok mee.
   * @param {*} piece 
   * @returns Geroteerd blokje
   */
  rotate(piece) {
    let p = JSON.parse(JSON.stringify(piece));

    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    p.shape.forEach(row => row.reverse());
    return p;
  }

  /**
   * Berekend de punten die je krijgt gebaseerd op hoeveel lijnen er zijn weggehaald en op welk level je zit.
   * @returns Punten
   */
  getLinesClearedPoints(lines, level) {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (account.level + 1) * lineClearPoints;
  }
}