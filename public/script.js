const colorpicker = document.getElementById("colorpicker");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

CANVAS_WIDTH = 1000;
CANVAS_HEIGHT = 500;

let currentColor = colorpicker.value;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.width = `${CANVAS_WIDTH}px`;
canvas.style.height = `${CANVAS_HEIGHT}px`;

ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function draw({ x, y, color }) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
  ctx.fill();
}

const init = function () {
  fetch(
    "https://api.tinybird.co/v0/pipes/get_snapshot.json?token=p.eyJ1IjogIjM0YmRiNTJkLTRiYjYtNDljZi04ZjdjLWI4MmM3MjVmNjRmNSIsICJpZCI6ICJiYzYwZjYzOC1lYzAwLTQxYTgtODhkNS05ZmNhZmNhNmI0MDUifQ.BBKGRtAlvq_cFP-anEaaYi6WSViUWQuVAvB_kSY4qig",
    {
      method: "get",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function ({ data }) {
      data.forEach(function (item) {
        draw(item);
      });
    });
};

function getMousePos(canvas, event) {
  let rect = canvas.getBoundingClientRect();

  return {
    x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top),
    color: currentColor,
  };
}

canvas.onmousedown = function (event) {
  const pixel = getMousePos(canvas, event);
  draw(pixel);
  ingestNewPixel(pixel);
};

colorpicker.oninput = function () {
  currentColor = this.value;
};

function now(secondsBefore = 0) {
  const d = new Date();
  const seconds = parseInt(d.getSeconds()) - secondsBefore;
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

init();

let isRequesting = false;

window.setInterval(function () {
  if (!isRequesting) {
    fetch(
      `https://api.tinybird.co/v0/pipes/get_snapshot.json?token=p.eyJ1IjogIjM0YmRiNTJkLTRiYjYtNDljZi04ZjdjLWI4MmM3MjVmNjRmNSIsICJpZCI6ICJiYzYwZjYzOC1lYzAwLTQxYTgtODhkNS05ZmNhZmNhNmI0MDUifQ.BBKGRtAlvq_cFP-anEaaYi6WSViUWQuVAvB_kSY4qig&date_start=${now(
        10
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        isRequesting = false;
        const array = data.data;
        array.forEach((item) => draw(item));
      });
  }
  isRequesting = true;
}, 1000);
