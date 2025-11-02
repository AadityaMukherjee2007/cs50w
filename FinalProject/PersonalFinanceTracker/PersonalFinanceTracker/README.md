# Personal Finance Tracker

## Overview

The **Personal Finance Tracker** is a Django‑based web application that helps users manage their income, expenses, and savings. It offers an organised view of spending habits and provides charts that make financial trends easier to understand. The goal is to give users a practical tool to gain better control over their money.

This project was created as my **final submission for CS50 Web Programming with Python and JavaScript**. It demonstrates what I learned in the course while also going beyond the scope of the problem sets. I designed and built a full-stack solution that includes user authentication, interactive UI features, and real‑time financial visualisation.

---

## Distinctiveness and Complexity

This application is not a copy or extension of any previous assignment. It approaches a real‑world problem and required me to combine several concepts from different stages of the course.

Here are the main aspects that make this project distinctive:

* A full finance management system rather than a simple CRUD interface
* A dynamic dashboard with charts representing spending behaviour
* Search and filtering options combining multiple fields
* JavaScript‑driven pagination that updates content without page reloads

The complexity comes from designing a system that feels seamless while still being fully secure and user‑specific:

* **Multi‑user authentication** ensures every user sees only their own financial data
* **Django QuerySets with filters and Q objects** allow layered search conditions
* **JSON endpoints** support asynchronous data updates
* **Custom JavaScript DOM updates** after adding or deleting transactions
* **A responsive layout** using Tailwind CSS to maintain consistent UI across desktop and mobile

Together, these elements help the project demonstrate clear full‑stack understanding.

Additionally, ensuring data privacy across users while maintaining application performance required thoughtful implementation decisions. I focused heavily on structuring the logic to keep pages interactive and responsive. Handling the dashboard analytics meant working not only with Django models but also dynamically updating the front end using JSON endpoints and JavaScript fetch calls. This introduced the challenge of maintaining UI consistency when asynchronous actions occur, such as deleting or adding a transaction.

The fact that every feature—from authentication to financial insights—was designed and coded from scratch (rather than using pre-made dashboards or templates) demonstrates the complexity and originality of the project.

---

---

## Features

This project focuses on user experience and practical financial management. Each feature was designed to help users understand and control their money more effectively, while ensuring the interface remains simple and intuitive.

* **User Accounts**

  * Login and registration with secure, isolated financial data

* **Transaction Management**

  * Add, edit, and delete both income and expenses
  * Categorise transactions for better insights

* **Dashboard Analytics**

  * Chart.js used to display spending vs. earning trends
  * Data updates dynamically as changes are made

* **Advanced Search Tools**

  * Filter transactions by category, date range, keyword, or amount

* **Pagination Without Reloads**

  * Improves usability with large financial histories

* **Responsive Layout**

  * Tailwind CSS was used for a cleaner and more modern design
  * I adapted a Tailwind navbar and customised it instead of using a default template

---

## Development Decisions

When planning the project, I wanted to create something that felt like a real, consumer‑ready product rather than a classroom prototype. This meant weighing trade‑offs between functionality, design, performance, and maintainability. For example, I chose to keep the application lightweight and efficient, making deliberate decisions about libraries used and data structure complexity.

* Tailwind CSS allowed fast styling with consistent spacing and structure
* Chart.js made it easier to display clear financial summaries
* I focused on minimising friction in common user tasks such as adding entries and checking recent spending

---

## Closing Notes

This project is more than just a course submission to me. I wanted to build something practical that people—including myself—would actually use in their daily lives. Managing personal finances is a universal need, and turning that concept into a polished application allowed me to apply nearly every major skill covered in CS50W.

Throughout development, I encountered new challenges involving asynchronous UI behaviour, data filtering logic, and user‑centric design choices. Solving these problems boosted my confidence as a full‑stack developer. I now feel far more capable of designing complete applications that are visually appealing, secure, and logically structured.

Thank you for reviewing this project. I am proud of the effort and detail that went into it, and I am eager to continue expanding its functionality in the future.
Thank you for reviewing my CS50W final project. I enjoyed combining concepts from the course into something useful and realistic. Building this application helped me strengthen both my backend and frontend skills, and I look forward to improving it further in the future.
