const colorpicker = document.getElementById("colorpicker");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

CANVAS_WIDTH = 1000;
CANVAS_HEIGHT = 500;

let currentWidth = CANVAS_WIDTH;
let currentHeight = CANVAS_HEIGHT;

let color = colorpicker.value;

let currentX = 0;
let currentY = 0;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const init = function () {
  color = colorpicker.value;

  currentWidth = CANVAS_WIDTH;
  currentHeight = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;

  draw();
};

window.onmousedown = function () {
    draw()
};


colorpicker.oninput = function () {
  color = this.value;
};


function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();

  currentX = Math.floor((event.clientX - rect.left));
  currentY = Math.floor((event.clientY - rect.top));
}

function draw() {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(currentX, currentY, 1, 1);
    ctx.fill();
}

window.onmousemove = function (event) {
  getMousePos(canvas, event);
};

init();
