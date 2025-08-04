document.addEventListener("DOMContentLoaded", function() {
    const transactionHeading = document.querySelector("#transactionHeading");
    let formContent = document.querySelector("form");
    formContent.style.display = "none";

    transactionHeading.addEventListener("click", () => {
        if (formContent.style.display === "none") {
            transactionHeading.classList.remove("justify-self-center")
            formContent.style.display = "block";
        } else {
            transactionHeading.classList.add("justify-self-center")
            formContent.style.display = "none";
        }
    })
})