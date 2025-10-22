const USER = document.getElementById("User").value;
const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
const transactionHeading = document.querySelector("#transactionHeading");
const transactionSearchHeading = document.querySelector("#transactionSearchHeading");
const transactions_div = document.getElementById("transactions");
let addFormContent = document.querySelector("#add_form");
let searchFormContent = document.querySelector("#search_form");

let editMode = false;
let editTransactionId = null;

document.addEventListener("DOMContentLoaded", function() {
    addFormContent.style.display = "none";
    searchFormContent.style.display = "none";

    transactionHeading.addEventListener("click", () => {
        if (addFormContent.style.display === "none") {
            addFormContent.style.display = "block";
            searchFormContent.style.display = "none";
            transactionSearchHeading.style.display = "none";
        } else {
            addFormContent.style.display = "none";
            transactionSearchHeading.style.display = "block";
        }
    });

    transactionSearchHeading.addEventListener("click", () => {
        if (searchFormContent.style.display === "none") {
            searchFormContent.style.display = "block";
            addFormContent.style.display = "none";
            transactionHeading.style.display = "none";
        } else {
            searchFormContent.style.display = "none";
            transactionHeading.style.display = "block";
        }
    });

    addTransaction();
    searchTransaction();
    displayTransactions();
    
});

function formatDate(isoDate) {
    let d = new Date(isoDate);
    return d.toLocaleDateString();
}

function addTransaction() {
    document.querySelector("form").onsubmit = (event) => {
        event.preventDefault();
        
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        const url = editMode ? "editTransaction" : "addTransaction";

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({
                id: editTransactionId,
                amount: amount,
                description: description,
                category: category,
                date: date
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            addFormContent.style.display = "none";
            transactionSearchHeading.style.display = "block";
            editTransactionId = null;
            editMode = false;
            // window.location.reload();
            displayTransactions();
        });
        // console.log(amount, description, category, date);
    }
}

function displayTransactions() {
    transactions_div.innerHTML = "";
    fetch(`getTransactions?user=${USER}`)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        let counter = 0;

        for (let transaction of result)
            counter++;
        
        for (let transaction of result)
        {
            // console.log(transaction);

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

        deleteTransaction();
        editTransaction();
    })
}

function deleteTransaction() {
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
                console.log(result);
                // window.location.reload();
                displayTransactions();
            })
            .catch(error => console.error("Error deleting:", error));
        });
    });
}

function editTransaction() {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const transaction_id = event.target.closest(".relative").getAttribute("data-id");
            // alert(transaction_id);

            fetch(`getTransaction?user=${USER}&id=${transaction_id}`)
            .then(response => response.json())
            .then(result => {
                console.log(result);

                const transactionHeading = document.querySelector("#transactionHeading");
                let form = document.querySelector("form");

                document.getElementById("submit-btn").innerHTML = "Edit Transaction";

                document.getElementById("amount").value = result["amount"];
                document.getElementById("description").value = result["description"];
                document.getElementById("category").value = result["category"];
                
                const date = new Date(result["datetime"]);
                document.getElementById("date").value = date.toISOString().split("T")[0];
                
                transactionHeading.classList.remove("justify-self-center")
                form.style.display = "block";

                window.scrollTo({ top: 0, behavior: 'smooth' });
                editMode = true;
                editTransactionId = transaction_id;

                /*const submit_btn = document.getElementById("submit-btn");
                submit_btn.onclick = (event) => {
                    // event.preventDefault();
                    // alert("edit form submitted");
                     fetch("editTransaction", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrf_token
                        },
                        body: JSON.stringify({
                            id: transaction_id,
                            amount: document.getElementById("amount").value,
                            description: document.getElementById("description").value,
                            category: document.getElementById("category").value,
                            datetime: document.getElementById("date").value
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        // window.location.reload();
                        displayTransactions();
                    })
                    .catch(error => console.error("Error editing:", error));
                    
                }*/
            })
            .catch(error => console.error("Error editing: ", error));
        });
    });
}

function craftUrlForSearch(amt, amt_choice, desc, cat, date) {
    let url = `searchTransactions?`;
    if (amt) {
        url += `amt=${amt}&amtchoice=${amt_choice}`;
    }
    
    if (desc) {
        url += `&desc=${desc}`;
    }

    if (cat) {
        url += `&cat=${cat}`;
    }

    if (date) {
        url += `&date=${date}`;
    }

    console.log(url);

    return url;
}

function searchTransaction() {
    document.getElementById("transactionSearchHeading").addEventListener("click", () => {
        // alert("Search Transaction");

        const equal_btn = document.getElementById("=");
        const less_equal_btn = document.getElementById("<=");
        const greater_equal_btn = document.getElementById(">=");

        let amt_choice = "=";
        
        equal_btn.onclick = () => {
            equal_btn.classList.add("bg-gray-200");
            less_equal_btn.classList.remove("bg-gray-200");
            greater_equal_btn.classList.remove("bg-gray-200");

            amt_choice = equal_btn.value;
        }

        less_equal_btn.onclick = () => {
            equal_btn.classList.remove("bg-gray-200");
            less_equal_btn.classList.add("bg-gray-200");
            greater_equal_btn.classList.remove("bg-gray-200");

            amt_choice = less_equal_btn.value;
        }

        greater_equal_btn.onclick = () => {
            equal_btn.classList.remove("bg-gray-200");
            less_equal_btn.classList.remove("bg-gray-200");
            greater_equal_btn.classList.add("bg-gray-200");

            amt_choice = greater_equal_btn.value;
        }

        document.getElementById("search_form").onsubmit = event => {
            event.preventDefault();

            const amt = document.getElementById("search_amount").value;
            const desc = document.getElementById("search_description").value;
            const cat = document.getElementById("search_category").value;
            const date = document.getElementById("search_date").value;

            console.log(amt, desc, cat, date);
            // alert(amt, desc, cat, date);

            if (!(amt || desc || cat || date)) {
                alert("Fillout atleast one search field!");
                event.preventDefault();
            }

            const url = craftUrlForSearch(amt, amt_choice, desc, cat, date);
            fetch(url)
            .then(response => response.json())
            .then(result => {
                // console.log(result);

                searchFormContent.style.display = "none";      // hide search form
                transactionSearchHeading.style.display = "block"; // show the heading so user can click again
                transactionHeading.style.display = "block";

                document.getElementById("search_amount").value = "";
                document.getElementById("search_description").value = "";
                document.getElementById("search_category").value = "";
                document.getElementById("search_date").value = "";
                amt_choice = "=";

                let counter = 0;
        
                for (let transaction of result)
                    counter++;

                transactions.innerHTML = "";
                
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
        
                deleteTransaction();
                editTransaction();
            })
            .catch(error => console.error("Error: ", error));
        }
    });
}