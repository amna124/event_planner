let token = "";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    alert("Login successful!");
    document.getElementById("eventForm").style.display = "block";
    fetchEvents();
  } else {
    alert("Invalid credentials!");
  }
});

const fetchEvents = async () => {
  const res = await fetch("http://localhost:5000/api/events", {
    headers: { Authorization: token },
  });

  const events = await res.json();
  eventList.innerHTML = "";
  events.forEach((event) => {
    const li = document.createElement("li");
    li.innerHTML = `${event.name} - ${event.date} (${event.category}) 
                        <button onclick="deleteEvent(${event.id})">❌</button>`;
    eventList.appendChild(li);
  });
};

document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("eventName").value;
  const date = document.getElementById("eventDate").value;
  const category = document.getElementById("eventCategory").value;

  await fetch("http://localhost:5000/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ name, date, category }),
  });

  fetchEvents();
});

const deleteEvent = async (id) => {
  await fetch(`http://localhost:5000/api/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  fetchEvents();
};
