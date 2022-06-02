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
};

canvas.onmousedown = function (event) {
  getMousePos(canvas, event);
  draw();
};

colorpicker.oninput = function () {
  color = this.value;
};

function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();

  currentX = Math.floor(event.clientX - rect.left);
  currentY = Math.floor(event.clientY - rect.top);
}

function now() {
  const d = new Date();
  const result = `${d.toISOString().slice(0, 10)} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  return result;
}

function draw() {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(currentX, currentY, 1, 1);
  ctx.fill();

  const row = {
    x: currentX,
    y: currentY,
    timestamp: now(),
    color: color,
  };

  fetch("https://api.tinybird.co/v0/events?name=pixels_table", {
    method: "post",
    headers: new Headers({
      Authorization:
        "Bearer p.eyJ1IjogIjM0YmRiNTJkLTRiYjYtNDljZi04ZjdjLWI4MmM3MjVmNjRmNSIsICJpZCI6ICJiYzYwZjYzOC1lYzAwLTQxYTgtODhkNS05ZmNhZmNhNmI0MDUifQ.BBKGRtAlvq_cFP-anEaaYi6WSViUWQuVAvB_kSY4qig",
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(row),
  });
}

init();
