const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

let events = [];

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", (req, res) => {
  const { name, date, category } = req.body;
  if (!name || !date || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newEvent = { id: Date.now(), name, date, category };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.delete("/api/events/:id", (req, res) => {
  events = events.filter((event) => event.id !== parseInt(req.params.id));
  res.json({ message: "Event deleted" });
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Planner</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            form { margin: 20px 0; }
            input, select, button { margin: 5px; padding: 8px; }
            ul { list-style: none; padding: 0; }
            li { background: #f4f4f4; margin: 5px; padding: 10px; display: flex; justify-content: space-between; }
        </style>
    </head>
    <body>
        <h1>Event Planner</h1>

        <form id="eventForm">
            <input type="text" id="eventName" placeholder="Event Name" required>
            <input type="date" id="eventDate" required>
            <select id="eventCategory">
                <option value="Meeting">Meeting</option>
                <option value="Birthday">Birthday</option>
                <option value="Appointment">Appointment</option>
            </select>
            <button type="submit">Add Event</button>
        </form>

        <h2>Upcoming Events</h2>
        <ul id="eventList"></ul>

        <script>
            const eventForm = document.getElementById("eventForm");
            const eventList = document.getElementById("eventList");

            // Fetch Events
            const fetchEvents = async () => {
                const res = await fetch("/api/events");
                const events = await res.json();
                eventList.innerHTML = "";
                events.forEach(event => {
                    const li = document.createElement("li");
                    li.innerHTML = \`\${event.name} - \${event.date} (\${event.category}) 
                                    <button onclick="deleteEvent(\${event.id})">❌</button>\`;
                    eventList.appendChild(li);
                });
            };

            // Add Event
            eventForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const name = document.getElementById("eventName").value;
                const date = document.getElementById("eventDate").value;
                const category = document.getElementById("eventCategory").value;

                await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, date, category }),
                });

                fetchEvents();
                eventForm.reset();
            });

            // Delete Event
            const deleteEvent = async (id) => {
                await fetch(\`/api/events/\${id}\`, { method: "DELETE" });
                fetchEvents();
            };

            // Load Events on Page Load
            fetchEvents();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
