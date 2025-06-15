if (!localStorage.getItem("x")) {
    localStorage.setItem("x", 0);
}

function count() {
    let x = localStorage.getItem("x");
    x++;
    document.querySelector('h1').innerHTML = x;
    localStorage.setItem("x", x);

    if (x % 10 === 0) {
        // `` is similar to a f-string in python
        alert(`The counter is now ${x}`)
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("h1").innerHTML = localStorage.getItem("x");
    document.querySelector('button').onclick = count;
    // document.querySelector('button').addEventListener("click", count);
});