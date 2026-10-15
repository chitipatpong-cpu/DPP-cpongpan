$("#calc-form").on("submit", function (event) {
    event.preventDefault(); // กันหน้ารีโหลด

    const leftText = $("#left").val().trim();
    const rightText = $("#right").val().trim();
    const op = $("#op").val();

    // ต้องเป็นจำนวนเต็ม >= 0 (ตัวเลขล้วน)
    const isPositiveInt = /^[0-9]+$/;
    if (!isPositiveInt.test(leftText) || !isPositiveInt.test(rightText)) {
        alert("Error :(");
        return;
    }

    const left = Number(leftText);
    const right = Number(rightText);

    if ((op === "/" || op === "%") && right === 0) {
        alert("It's over 9000!");
        return;
    }

    let result;
    if (op === "+") result = left + right;
    else if (op === "-") result = left - right;
    else if (op === "*") result = left * right;
    else if (op === "/") result = left / right;
    else result = left % right;

    console.log(result);
    alert(result);
});

setInterval(function () {
    alert("Please, use me...");
}, 30000);
