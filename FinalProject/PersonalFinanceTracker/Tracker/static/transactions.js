const USER = document.getElementById("User").value;
const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
const transactionHeading = document.querySelector("#transactionHeading");
const transactionSearchHeading = document.querySelector("#transactionSearchHeading");
const transactions_div = document.getElementById("transactions");
let addFormContent = document.querySelector("#add_form");
let searchFormContent = document.querySelector("#search_form");

let editMode = false;
let editTransactionId = null;

let currentPage = 1;
const perPage = 5;
let hasNext = false, hasPrev = false;

let counter = 0;

document.addEventListener("DOMContentLoaded", function() {
    addFormContent.style.display = "none";
    searchFormContent.style.display = "none";

    transactionHeading.addEventListener("click", () => {
        const isCurrentlyVisible = addFormContent.style.display === "block";
        resetFormState();
    
        if (!isCurrentlyVisible) {
            addFormContent.style.display = "block";
            transactionSearchHeading.classList.add("hidden");
            transactionHeading.classList.remove("hidden");
        }
    });
    
    transactionSearchHeading.addEventListener("click", () => {
        const isCurrentlyVisible = searchFormContent.style.display === "block";
        resetFormState();
    
        if (!isCurrentlyVisible) {
            searchFormContent.style.display = "block";
            transactionHeading.classList.add("hidden");
            transactionSearchHeading.classList.remove("hidden");
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

function resetFormState() {
    // Hide both forms
    addFormContent.style.display = "none";
    searchFormContent.style.display = "none";

    // Show both headings again
    transactionHeading.classList.remove("hidden");
    transactionSearchHeading.classList.remove("hidden");

    // Restore header alignment
    const formHeader = document.getElementById("formHeader");
    formHeader.classList.add("justify-between");
    formHeader.classList.remove("justify-center");

    // Remove existing exit button if any
    const existingExit = formHeader.querySelector(".exit-btn");
    if (existingExit) existingExit.remove();
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

            document.getElementById("amount").value = "";
            document.getElementById("description").value = "";
            document.getElementById("category").value = "";
            document.getElementById("date").value = "";
            document.getElementById("submit-btn").innerHTML = "Add Transaction";

            transactionHeading.classList.add("hidden");
            transactionSearchHeading.classList.add("hidden");

            document.getElementById("formHeader").classList.remove("justify-between");
            document.getElementById("formHeader").classList.add("justify-center");

            displayTransactions();
        });
        // console.log(amount, description, category, date);
    }
}

function pageNav() {
    const prev_btn = document.getElementById("prevPage");
    const next_btn = document.getElementById("nextPage");

    if (!hasPrev && hasNext) {
        prev_btn.classList.add("hidden");
        next_btn.classList.remove("hidden");
    } else if (hasPrev && !hasNext) {
        prev_btn.classList.remove("hidden");
        next_btn.classList.add("hidden");
    } else if (hasPrev && hasNext) {
        prev_btn.classList.remove("hidden");
        next_btn.classList.remove("hidden");
    } else if (!hasPrev && !hasNext) {
        prev_btn.classList.add("hidden");
        next_btn.classList.add("hidden");
    }

    prev_btn.onclick = () => {
        currentPage--;
        displayTransactions();
    }

    next_btn.onclick = () => {
        currentPage++;
        displayTransactions();
    }
}

function displayTransactions() {
    transactions_div.innerHTML = "";
    fetch(`getTransactions?user=${USER}&page=${currentPage}&per_page=${[perPage]}`)
    .then(response => response.json())
    .then(result => {
        console.log(result);

        counter = result.totalTransactions - (currentPage - 1) * perPage;

        hasNext = result.has_next;
        hasPrev = result.has_previous;
        pageNav();
        
        for (let transaction of result.transactions)
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

                transactionHeading.classList.add("hidden");
                transactionSearchHeading.classList.add("hidden");

                const formHeader = document.getElementById("formHeader");

                // Remove any existing exit first
                const oldExit = formHeader.querySelector(".exit-btn");
                if (oldExit) oldExit.remove();

                const exit = document.createElement("div");
                exit.innerHTML = "x";
                exit.className = "exit-btn border border-indigo-500 text-indigo-500 rounded-full px-3 py-1 cursor-pointer hover:bg-indigo-500 hover:text-white";
                formHeader.appendChild(exit);
                
                document.getElementById("formHeader").classList.remove("justify-between");
                document.getElementById("formHeader").classList.add("justify-center");

                exit.onclick = () => {
                    resetFormState();
                    document.getElementById("amount").value = "";
                    document.getElementById("description").value = "";
                    document.getElementById("category").value = "";
                    document.getElementById("date").value = "";
                    document.getElementById("submit-btn").innerHTML = "Add Transaction";
                };
                

                document.getElementById("submit-btn").innerHTML = "Edit Transaction";

                document.getElementById("amount").value = result["amount"];
                document.getElementById("description").value = result["description"];
                document.getElementById("category").value = result["category"];
                
                const date = new Date(result["datetime"]);
                document.getElementById("date").value = date.toISOString().split("T")[0];
                addFormContent.style.display = "block";

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
    let url = `getTransactions?page=${currentPage}&per_page=${perPage}`;
    if (amt) {
        url += `&amt=${amt}&amtchoice=${amt_choice}`;
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
                console.log(result);

                searchFormContent.style.display = "none";      
                transactionSearchHeading.style.display = "block"; 
                transactionHeading.style.display = "block";

                document.getElementById("search_amount").value = "";
                document.getElementById("search_description").value = "";
                document.getElementById("search_category").value = "";
                document.getElementById("search_date").value = "";
                amt_choice = "=";

                counter = result.totalTransactions - (currentPage - 1) * perPage;
        
                hasNext = result.has_next;
                hasPrev = result.has_previous;
                pageNav();

                transactions.innerHTML = "";
                
                for (let transaction of result.transactions)
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