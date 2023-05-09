// TO DO: implement everything using flat arrays
// TO DO: switch to requestAnimationFrame() instead of setInterval()
// TO DO: implement offscreen canvas buffering

'use strict';

const root = document.getElementById('root');
const form = document.getElementById('form');
const run = document.getElementById('run');

const canvasParams = [];

const DEAD_COLOR = 'white';
const STROKE_COLOR = 'lightgray';

let canvas;
let ctx;
let r = 30;
let board = [];
let intervalId;
let isRunning = false;
let speed = 50;

function generateBoardObj(w, h) {
  if (board.length) board.splice(0, board.length);
  for (let i = 0; i < h / r; i++) {
    const row = [];
    for (let j = 0; j < w / r; j++) {
      const cell = {
        i,
        j,
        alive: false,
      };
      row.push(cell);
    }
    board.push(row);
  }
}

function renderBoard() {
  const [w, h] = canvasParams;
  for (let i = 0; i < h / r; i++) {
    for (let j = 0; j < w / r; j++) {
      ctx.strokeStyle = STROKE_COLOR;
      if (board[i][j].alive) ctx.fillStyle = `rgb(${i * 8},155,${j * 8})`;
      else ctx.fillStyle = DEAD_COLOR;
      ctx.fillRect(j * r, i * r, r, r);
      ctx.strokeRect(j * r, i * r, r, r);
    }
  }
}

function getValidNeighbours(i, j, board) {
  const validNeighbours = [];
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if ((di !== 0 || dj !== 0) && board[i + di]) {
        if (board[i + di][j + dj]) {
          validNeighbours.push(board[i + di][j + dj]);
        }
      }
    }
  }
  return validNeighbours;
}

function getLiveNeighbourCount(i, j, board) {
  let count = 0;
  const neighbours = getValidNeighbours(i, j, board);
  for (const neighbour of neighbours) {
    if (neighbour.alive) count++;
  }
  return count;
}

function cellClickHandler(e) {
  const { offsetX: mouseX, offsetY: mouseY } = e;
  const i = Math.floor(mouseY / r);
  const j = Math.floor(mouseX / r);
  console.log(i, j);
  const neighbours = getValidNeighbours(i, j, board);
  if (board[i][j].alive) {
    board[i][j].alive = false;
    for (const neighbour of neighbours) neighbour.liveNeighbourCount--;
  } else {
    board[i][j].alive = true;
    for (const neighbour of neighbours) neighbour.liveNeighbourCount++;
  }
  renderBoard();
}

function generateNextBoardObj() {
  const [w, h] = canvasParams;
  const nextBoard = [];
  for (let i = 0; i < h / r; i++) {
    const nextRow = [];
    for (let j = 0; j < w / r; j++) {
      const nextCell = {
        i,
        j,
        alive: false,
        liveNeighbourCount: 0,
      };
      // game rules implementation
      if (board[i][j].alive) {
        if (board[i][j].liveNeighbourCount < 2 || board[i][j].liveNeighbourCount > 3) nextCell.alive = false;
        else nextCell.alive = true;
      } else {
        if (board[i][j].liveNeighbourCount === 3) nextCell.alive = true;
      }
      nextRow.push(nextCell);
    }
    nextBoard.push(nextRow);
  }
  for (let i = 0; i < h / r; i++) {
    for (let j = 0; j < w / r; j++) {
      nextBoard[i][j].liveNeighbourCount = getLiveNeighbourCount(i, j, nextBoard);
    }
  }
  return nextBoard;
}

function runSimulation() {
  if (!isRunning) {
    intervalId = setInterval(() => {
      const nextBoard = generateNextBoardObj();
      board = JSON.parse(JSON.stringify(nextBoard));
      renderBoard();
    }, speed);
  }
  run.textContent = 'STOP';
  isRunning = true;
}

function stopSimulation() {
  if (isRunning) {
    clearInterval(intervalId);
  }
  run.textContent = 'RUN';
  isRunning = false;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  stopSimulation();
  if (canvas) canvas.remove();
  canvasParams.splice(0, canvasParams.length);
  r = document.getElementById('cell-radius').value;
  canvasParams.push(document.getElementById('canvas-width').value);
  canvasParams.push(document.getElementById('canvas-height').value);
  const [w, h] = canvasParams;
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = w;
  canvas.height = h;
  root.append(canvas);
  ctx = canvas.getContext('2d');
  canvas.addEventListener('mousedown', e => {
    cellClickHandler(e);
  });
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, w, h);
  generateBoardObj(w, h);
  for (let i = 0; i < h / r; i++) {
    for (let j = 0; j < w / r; j++) {
      board[i][j].liveNeighbourCount = getLiveNeighbourCount(i, j, board);
    }
  }
  renderBoard();
});

run.addEventListener('click', () => {
  if (board.length) {
    if (isRunning) {
      stopSimulation();
    } else {
      runSimulation();
    }
  }
});
