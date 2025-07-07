document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function reply_email(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    document.querySelector('#compose-recipients').value = email.sender;

    if (email.subject.startsWith("Re:")) {
      document.querySelector('#compose-subject').value = email.subject;
    } else {
      document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
    }
    
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n\n${email.body}`;
    });
}

function load_archived() {
  fetch('/emails/archive')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      let archived_emails = document.createElement('ul');
      archived_emails.id = "archived_emails";
      archived_emails.className = "list-group";

      emails.forEach((email) => {
        let archived_email = document.createElement('li');
        archived_email.className = "list-group-item list-group-item-action";

        let data = document.createElement('div');
        data.innerHTML = `<strong>To: </strong>${email.recipients}<br><strong>Subject: </strong>${email.subject}<br><strong>Timestamp: </strong>${email.timestamp}`;

        archived_email.appendChild(data);
        archived_emails.appendChild(archived_email);
        archived_email.addEventListener('click', () => load_email(email.id));
      })
      document.querySelector('#emails-view').appendChild(archived_emails);
  });
}

function load_inbox() {
  fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      console.log(emails);

      // Clear previous emails
      document.querySelector('#emails-view').innerHTML = '';

      let received_emails = document.createElement('ul');
      received_emails.className = "list-group";

      emails.forEach((email) => {
        let received_email = document.createElement('li');
        received_email.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center flex-wrap";
        received_email.style.backgroundColor = email.read ? "lightgrey" : "white";
        received_email.style.cursor = "pointer";

        let left = document.createElement('div');
        left.className = "d-flex flex-column flex-md-row";

        let sender = document.createElement('div');
        sender.className = "me-3 fw-bold";
        sender.innerText = email.sender;

        let subject = document.createElement('div');
        subject.className = "text-truncate pl-3";
        subject.style.maxWidth = "250px";
        subject.innerText = email.subject;

        left.appendChild(sender);
        left.appendChild(subject);

        let timestamp = document.createElement('div');
        timestamp.className = "text-muted text-end ms-auto";
        timestamp.innerText = email.timestamp;

        received_email.appendChild(left);
        received_email.appendChild(timestamp);

        received_email.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({ read: true })
          });
          load_email(email.id);
        });

        received_emails.appendChild(received_email);
      })

      document.querySelector('#emails-view').appendChild(received_emails);
    });
}

function load_email(id, mailbox) {
  document.querySelector('#emails-view').innerHTML = '';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      let info = document.createElement('div');
      info.innerHTML = `
      <div><strong>From:</strong> ${email.sender}</div>
      <div><strong>To:</strong> ${email.recipients}</div>
      <div><strong>Subject:</strong> ${email.subject}</div>
      <div class="mb-1"><strong>Date:</strong> ${email.timestamp}</div>

      <div>
        <button id="reply_btn" class="btn btn-outline-primary btn-sm">Reply</button>
        <button id="archive_btn" class="btn btn-outline-primary btn-sm">${email.archived ? "Unarchive" : "Archive"}</button>
        <button id="read_btn" class="btn btn-outline-primary btn-sm">${email.read ? "Mark as Unread" : "Mark as Read"}</button>
      </div>

      <div class="border mt-2 mb-2"></div>
      `;

      let body = document.createElement("pre");
      body.className = "ml-2 mt-4";
      body.innerHTML = email.body;

      document.querySelector('#emails-view').appendChild(info);
      document.querySelector('#emails-view').appendChild(body);

      const user = document.querySelector("h2").innerText.trim();
      if (mailbox == "sent") {
        document.querySelector("#archive_btn").style.display = "none";
        document.querySelector("#read_btn").style.display = "none";
      }

      document.querySelector("#reply_btn").addEventListener("click", () => reply_email(email.id));

      document.querySelector("#read_btn").addEventListener("click", () => {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: !email.read
          })
        })
        .then(() => load_mailbox('inbox'));
      });

      document.querySelector("#archive_btn").addEventListener("click", () => {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email.archived
          })
        })
        .then(() => {
          load_mailbox('inbox');
        });
      });
  });
}

function load_sent() {
  fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      let sent_emails = document.createElement('ul');
      sent_emails.id = "sent_emails";
      sent_emails.className = "list-group";

      emails.forEach((email) => {
        let sent_email = document.createElement('li');
        sent_email.className = "list-group-item list-group-item-action";

        let data = document.createElement('div');
        data.innerHTML = `<strong>To: </strong>${email.recipients}<br><strong>Subject: </strong>${email.subject}<br><strong>Timestamp: </strong>${email.timestamp}`;

        sent_email.appendChild(data);
        sent_emails.appendChild(sent_email);
        sent_email.addEventListener('click', () => load_email(email.id, "sent"));
      })
      document.querySelector('#emails-view').appendChild(sent_emails);
  });
}

function send_email(event) {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  console.log(recipients, subject, body)

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.error || "Failed to send email.");
      });
    }
    response.json();
  })
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox("sent");
  })
  .catch(error => {
    alert(error.message);
    load_sent();
  });
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  if (mailbox === "sent") {
    load_sent();
  } else if (mailbox === "inbox") {
    load_inbox();
  } else if (mailbox === "archive") {
    load_archived();
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}