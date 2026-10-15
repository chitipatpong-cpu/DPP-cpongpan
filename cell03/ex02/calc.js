const form =document.getElementById('calc-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
     const leftText = document.getElementById('left').value.trim();
     const rightText = document.getElementById('right').value.trim();
     const op = document.getElementById('op').value;
     
     const isPositiveInt = /^[0-9]+$/;
     if (!isPositiveInt.test(leftText) || !isPositiveInt.test(rightText)) {
         alert('Error:(")');
         return;
     }

     const left = Number(leftText);
     const right = Number(rightText);
     
     if ((op === '/' || op === '%') && right === 0) {
         alert("It's over 9000!");
         return;
     }

     let result;
     if (op === '+') result = left + right;
     else if (op === '-') result = left - right;
     else if (op === '*') result = left * right;
     else if (op === '/') result = left / right;
     else result = left % right;

     console.log(result);
     alert(result);
});

setInterval(function() {
    alert("please, use me...");
}, 30000);