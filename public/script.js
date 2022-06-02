const colorpicker = document.getElementById("colorpicker");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

CANVAS_WIDTH = 1000;
CANVAS_HEIGHT = 500;

let currentWidth = CANVAS_WIDTH;
let currentHeight = CANVAS_HEIGHT;

let currentColor = colorpicker.value;

let currentX = 0;
let currentY = 0;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const init = function () {
  currentWidth = CANVAS_WIDTH;
  currentHeight = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;

  fetch("https://api.tinybird.co/v0/pipes/get_snapshot.json?token=p.eyJ1IjogIjM0YmRiNTJkLTRiYjYtNDljZi04ZjdjLWI4MmM3MjVmNjRmNSIsICJpZCI6ICJiYzYwZjYzOC1lYzAwLTQxYTgtODhkNS05ZmNhZmNhNmI0MDUifQ.BBKGRtAlvq_cFP-anEaaYi6WSViUWQuVAvB_kSY4qig", {
    method: "get",
  }).then(function(response) {
    return response.json()
  }).then(function({data}) {
    data.forEach(function({x,y,color}) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    })
  })
};

canvas.onmousedown = function (event) {
  const pixel = getMousePos(canvas, event);
  draw(pixel);
  ingestNewPixel(pixel);
};

colorpicker.oninput = function () {
  currentColor = this.value;
};

function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();

  return {
    x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top),
    color: currentColor,
  };
}

function now(secondsBefore = 0) {
  const d = new Date();
  const seconds = d.getSeconds() - secondsBefore;
  const result = `${d
    .toISOString()
    .slice(0, 10)} ${d.getHours()}:${d.getMinutes()}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
  return result;
}
function ingestNewPixel(pixel) {
  const row = {
    ...pixel,
    timestamp: now(),
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

function draw(pixel) {
  ctx.beginPath();
  ctx.fillStyle = pixel.color;
  ctx.fillRect(pixel.x, pixel.y, 1, 1);
  ctx.fill();
}

init();

window.setInterval(function () {
  fetch(
    `https://api.tinybird.co/v0/pipes/get_snapshot.json?token=p.eyJ1IjogIjM0YmRiNTJkLTRiYjYtNDljZi04ZjdjLWI4MmM3MjVmNjRmNSIsICJpZCI6ICJiYzYwZjYzOC1lYzAwLTQxYTgtODhkNS05ZmNhZmNhNmI0MDUifQ.BBKGRtAlvq_cFP-anEaaYi6WSViUWQuVAvB_kSY4qig&date_start=${now(
      10
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      const array = data.data;
      array.map((item) => draw(item));
    });
}, 1000);
