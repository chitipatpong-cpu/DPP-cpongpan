const balloon = document.getElementById("balloon");
const colors = ["red", "green", "blue"];
let size = 200;
let colorIndex = 0;

function draw() {
  balloon.style.width = size + "px";
  balloon.style.height = size + "px";
  balloon.style.backgroundColor = colors[colorIndex];
}

balloon.addEventListener("click", function () {
  size += 10;
  colorIndex = (colorIndex + 1) % 3;
  if (size > 420) {
    size = 200;
    colorIndex = 0;
  }
  draw();
});

balloon.addEventListener("mouseleave", function () {
  if (size > 200) size -= 5;
  colorIndex = (colorIndex + 2) % 3;
  draw();
});