document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("dropdownToggle");
    const menu = document.getElementById("dropdownMenu");
    
    toggle.addEventListener("click", function (e) {
        e.stopPropagation(); 
        menu.classList.toggle("hidden");
    });

    document.addEventListener("click", function () {
        menu.classList.add("hidden");
    });
})