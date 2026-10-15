const button = document.getElementById("btn");
let size = 16;

button.addEventListener("click", function () {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    document.body.style.backgroundColor = rgbColor;

    button.style.color = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;

    size += 4;
    button.style.fontSize = size + "px";
    if (size > 40) {
        size = 16;
        colorIndex = 0;
  }
});

