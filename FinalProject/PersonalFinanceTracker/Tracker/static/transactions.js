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
    });

    document.querySelector("form").onsubmit = () => {
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        fetch("addTransaction")
        .then(reposnse => esponse())
        
        // console.log(amount, description, category, date);
    }
})