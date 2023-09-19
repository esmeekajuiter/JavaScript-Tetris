const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');
const spriteSheet = 'img/BlockColors.png';

var image = new Image();
image.src = spriteSheet;

let accountValues = {
  score: 0,
  level: 0,
  lines: 0
}

/**
 * Update de cijfers gebaseerd op de opgevraagde key, value.
 */
function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

/**
 * Verandert het account met de geupdate values.
 */
let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

let requestId;

moves = {
  [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: p => board.rotate(p)
};

let board = new Board(ctx, ctxNext);
addEventListener();
initNext();

/**
 * Bereken de grote van het canvas gebaseerd op constanten.
 */
function initNext() {
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

/**
 * Reageert op de toets die is ingedrukt.
 * Pauzeert, Gameover, beweegt het blokje.
 */
function addEventListener() {
  document.addEventListener('keydown', event => {
    if (event.keyCode === KEY.P) {
      pause();
    }
    if (event.keyCode === KEY.ESC) {
      gameOver();
    } else if (moves[event.keyCode]) {
      event.preventDefault();
      let p = moves[event.keyCode](board.piece);
      if (event.keyCode === KEY.SPACE) {
        while (board.valid(p)) {
          account.score += POINTS.HARD_DROP;
          board.piece.move(p);
          p = moves[KEY.DOWN](board.piece);
        }
      } else if (board.valid(p)) {
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP;         
        }
      }
    }
  });
}

/**
 * Reset de accountValues. Maakt een nieuwe game voor je aan.
 */
function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

/**
 * Begin met een lege game. Als er nog ergens een oude game loopt, wordt die gecanceld.
 */
function play() {
  resetGame();
  time.start = performance.now();
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
}

/**
 * Als het blokje niet geplaatst kan worden, game over.
 * Leeg het bord voordat je begint met de draw.
 * Laat weten dat de requestId geset wordt voordat het spel start.
 */
function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw(ctx);
  requestId = requestAnimationFrame(animate);
}

/**
 * Als je gameover bent, stopt de requestId.
 * Je krijgt een blok in beeld dat je game over bent.
 * De highscore wordt geupdate als dat nodig is.
 */
function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
  showCookies();
}

/**
 * Laat je weten dat je gepauzeerd bent, slaat op dat je niet bezig bent met een andere game.
 */
function pause() {
  if (!requestId) {
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
}