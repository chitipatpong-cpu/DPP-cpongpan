const colors = ["red", "green", "blue"];
let size = 200;
let colorIndex = 0;

// วาดลูกโป่งตามขนาดและสีปัจจุบัน
function draw() {
    $("#balloon").css({
        "width": size + "px",
        "height": size + "px",
        "background-color": colors[colorIndex]
    });
}

$("#balloon").on("click", function () {
    size += 10;
    colorIndex = (colorIndex + 1) % 3;   // แดง → เขียว → น้ำเงิน
    if (size > 420) {                    // ระเบิด: กลับไปเริ่มใหม่
        size = 200;
        colorIndex = 0;
    }
    draw();
});

$("#balloon").on("mouseleave", function () {
    if (size > 200) {
        size -= 5;
    }
    colorIndex = (colorIndex + 2) % 3;   // ย้อนลำดับ: ถอยหลัง 1 สี
    draw();
});
