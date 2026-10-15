// สร้างรายการใหม่ แล้วใส่บนสุดหรือล่างสุดของลิสต์
function addTodo(text, onTop) {
    const todo = $("<div></div>").text(text);

    todo.on("click", function () {
        if (confirm("Remove this TO DO?")) {
            $(this).remove();
            saveTodos();
        }
    });

    if (onTop) {
        $("#ft_list").prepend(todo);
    } else {
        $("#ft_list").append(todo);
    }
}

// เก็บข้อความทุกรายการ (บนลงล่าง) ลง cookie อายุ 365 วัน
function saveTodos() {
    const todos = [];
    $("#ft_list div").each(function () {
        todos.push($(this).text());
    });
    document.cookie = "todos=" + encodeURIComponent(JSON.stringify(todos)) + "; max-age=" + 365 * 24 * 60 * 60;
}

// อ่าน cookie ตอนเปิดหน้า แล้วแสดงตามลำดับเดิม
function loadTodos() {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("todos=")) {
            const todos = JSON.parse(decodeURIComponent(cookies[i].substring(6)));
            for (let j = 0; j < todos.length; j++) {
                addTodo(todos[j], false);
            }
        }
    }
}

$("#new").on("click", function () {
    const text = prompt("Enter a new TO DO:");
    if (text === null || text.trim() === "") {
        return; // กด Cancel หรือเว้นว่าง
    }
    addTodo(text.trim(), true);
    saveTodos();
});

loadTodos();
