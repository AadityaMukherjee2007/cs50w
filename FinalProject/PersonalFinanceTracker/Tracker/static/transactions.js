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
            counter++;
        
        for (let transaction of result)
        {
            console.log(transaction);

            let transactionDiv = document.createElement("div");
            transactionDiv.className = "max-w-2xl mx-auto mt-4 bg-white shadow-md rounded-lg p-4 border border-gray-200";

            transactionDiv.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Transaction #${counter}</h3>
                    <p class="text-gray-700"><span class="font-semibold">Amount:</span> $${transaction.amount}</p>
                    <p class="text-gray-700"><span class="font-semibold">Description:</span> ${transaction.description}</p>
                    <p class="text-gray-700"><span class="font-semibold">Category:</span> ${transaction.category__name}</p>
                    <p class="text-gray-700"><span class="font-semibold">Date:</span> ${formatDate(transaction.datetime)}</p>
                </div>
                <div class="relative" data-id="${transaction.id}">
                    <div class="absolute right-0 bottom-0">
                        <button class="edit-btn m-1 p-2 rounded-lg bg-sky-400 hover:bg-sky-500">Edit</button>
                        <button class="delete-btn m-1 p-2 rounded-lg bg-red-500 hover:bg-red-600">Delete</button>
                    </div>
                </div>
            `;

            // transaction.addEventListener("contextmenu", (event))

            transactions_div.appendChild(transactionDiv);
            counter--;
        }

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const transaction_id = event.target.closest(".relative").getAttribute("data-id");
                // alert(transaction_id);

                fetch("deleteTransaction", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrf_token
                    },
                    body: JSON.stringify({
                        id: transaction_id
                    })
                })
                .then(response => response.json())
                .then(result => {
                    // alert(result["message"]);
                    window.location.reload();
                })
                .catch(error => console.error("Error deleting:", error));
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const transaction_id = event.target.closest(".relative").getAttribute("data-id");
                // alert(transaction_id);

                fetch(`getTransaction?user=${USER}&id=${transaction_id}`)
                .then(response => response.json())
                .then(result => {
                    console.log(result);

                    const transactionHeading = document.querySelector("#transactionHeading");
                    let form = document.querySelector("form");

                    document.getElementById("amount").value = result["amount"];
                    document.getElementById("description").value = result["description"];
                    document.getElementById("category").value = result["category"];
                    
                    const date = new Date(result["datetime"]);
                    document.getElementById("date").value = date.toISOString().split("T")[0];
                    
                    transactionHeading.classList.remove("justify-self-center")
                    form.style.display = "block";

                    form.addEventListener("submit", event => {
                        alert("edit form submitted");
                        
                    });
                })
                .catch(error => console.error("Error editing: ", error));
            });
        });
    });
})