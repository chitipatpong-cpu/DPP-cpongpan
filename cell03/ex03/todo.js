
const list = document.getElementById("ft_list");
const button = document.getElementById("new");

// Create a new TO DO
button.addEventListener("click", function() {
    const text = prompt("Enter a new TO DO:");

    if (text === null || text.trim() === "") {
        return;
    }

    addTodo(text.trim(), true);
    saveTodos();
});

// Add TO DO to the list
function addTodo(text, top = false) {
    const todo = document.createElement("div");
    todo.textContent = text;

    todo.addEventListener("click", function() {
        if (confirm("Remove this TO DO?")) {
            todo.remove();
            saveTodos();
        }
    });

    if (top) {
        list.prepend(todo);
    } else {
        list.appendChild(todo);
    }
}

// Save TO DO list as a cookie
function saveTodos() {
    const todos = [];

    for (const todo of list.children) {
        todos.push(todo.textContent);
    }

    document.cookie = "todos=" +
        encodeURIComponent(JSON.stringify(todos)) +
        "; max-age=31536000; path=/; SameSite=Lax";
}

// Load TO DO list from cookie
function loadTodos() {
    const cookie = document.cookie
        .split("; ")
        .find(item => item.startsWith("todos="));

    if (!cookie) {
        return;
    }

    try {
        const todos = JSON.parse(
            decodeURIComponent(cookie.substring(6))
        );

        if (Array.isArray(todos)) {
            todos.forEach(function(text) {
                if (typeof text === "string") {
                    addTodo(text);
                }
            });
        }
    } catch (error) {
        console.log("Invalid cookie");
    }
}

loadTodos();