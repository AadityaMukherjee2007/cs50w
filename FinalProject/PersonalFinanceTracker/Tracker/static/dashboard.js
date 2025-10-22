document.addEventListener("DOMContentLoaded", function () {
  fetch("getGraphData")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      document.getElementById("total_income").innerHTML = "$" + data["total_income"];
      document.getElementById("total_expense").innerHTML = "$" + data["total_expense"];
      document.getElementById("total_savings").innerHTML = "$" + data["total_savings"];

      const labels = ["Income", "Expense", "Savings"];
      const values = [
        data.total_income,
        data.total_expense,
        data.total_savings,
      ];

      new Chart(document.getElementById("finance_graph_1"), {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total",
              data: values,
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Financial Overview" },
          },
        },
      });

      new Chart(document.getElementById("finance_graph_2"), {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total",
              data: values,
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Financial Overview" },
          },
        },
      });
    })
    .catch((error) => console.error("Error: ", error));
});
