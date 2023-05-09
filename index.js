'use strict';

const root = document.getElementById('root');
const form = document.getElementById('form');

const canvasParams = [];
const board = [];
const r = 10;

const ALIVE_COLOR = 'black';
const DEAD_COLOR = 'white';
const STROKE_COLOR = 'black';

let canvas;
let ctx;

function generateBoardObj(w, h) {
  if (board.length) board.splice(0, board.length);
  const colCount = w / r;
  const rowCount = h / r;
  for (let i = 0; i < rowCount; i++) {
    const row = [];
    for (let j = 0; j < colCount; j++) {
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
  for (let i = 0; i < h / 10; i++) {
    for (let j = 0; j < w / 10; j++) {
      ctx.strokeStyle = STROKE_COLOR;
      if (board[i][j].alive) ctx.fillStyle = ALIVE_COLOR;
      else ctx.fillStyle = DEAD_COLOR;
      ctx.fillRect(j * r, i * r, r, r);
      ctx.strokeRect(j * r, i * r, r, r);
    }
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  if (canvas) canvas.remove();
  canvasParams.splice(0, canvasParams.length);
  canvasParams.push(document.getElementById('canvas-width').value);
  canvasParams.push(document.getElementById('canvas-height').value);
  const [w, h] = canvasParams;
  canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  root.append(canvas);
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, w, h);
  generateBoardObj(w, h);
  renderBoard();
});