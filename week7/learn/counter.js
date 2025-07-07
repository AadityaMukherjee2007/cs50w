document.addEventListener("DOMContentLoaded", () => {
    let counter = 0;
    let display = document.querySelector("h1");
    display.innerHTML = counter;

    document.querySelector("#increase").onclick = () => {
        counter++;
        display.innerHTML = counter;
    }

    document.querySelector("#decrease").onclick = () => {
        counter--;
        display.innerHTML = counter;
    }
});