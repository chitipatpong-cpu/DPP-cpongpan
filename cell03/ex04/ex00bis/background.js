let fontSize = 14; // ตรงกับ font-size ใน CSS

function randomNumber() {
    return Math.floor(Math.random() * 256); // 0-255
}

$("#btn").on("click", function () {
    const color = "rgb(" + randomNumber() + ", " + randomNumber() + ", " + randomNumber() + ")";
    $("body").css("background-color", color);

    fontSize += 4;
    $(this).css("font-size", fontSize + "px");
});
