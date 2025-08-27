function formatDate(isoDate) {
    let d = new Date(isoDate);
    return d.toLocaleDateString();
}

document.addEventListener("DOMContentLoaded", function() {
    const USER = document.getElementById("User").value;
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const transactionHeading = document.querySelector("#transactionHeading");
    const transactions_div = document.getElementById("transactions");
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

        fetch("addTransaction", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({
                amount: amount,
                description: description,
                category: category,
                date: date
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });
        // console.log(amount, description, category, date);
    }

    fetch(`getTransactions?user=${USER}`)
    .then(response => response.json())
    .then(result => {
        // console.log(result);

        let counter = 0;
        for (let transaction of result)
        {
            counter++;
            console.log(transaction);

            let transactionDiv = document.createElement("div");
            transactionDiv.className = "max-w-2xl mx-auto mt-4 bg-white shadow-md rounded-lg p-4 border border-gray-200";

            transactionDiv.innerHTML = `
                <h3 class="text-lg font-bold text-gray-800 mb-2">Transaction #${counter}</h3>
                <p class="text-gray-700"><span class="font-semibold">Amount:</span> £${transaction.amount}</p>
                <p class="text-gray-700"><span class="font-semibold">Description:</span> ${transaction.description}</p>
                <p class="text-gray-700"><span class="font-semibold">Category:</span> ${transaction.category__name}</p>
                <p class="text-gray-700"><span class="font-semibold">Date:</span> ${formatDate(transaction.datetime)}</p>
            `;

            // transaction.addEventListener("contextmenu", (event))

            transactions_div.appendChild(transactionDiv);
        }
    });

})