const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "Hey Man!!"; // choose any string
const ACCESS_TOKEN = "EAAyQo0ya3xsBQ3yoJrCI9iwZCcwWEZBZCgYH8iU1EdCEqlrwAnmKYhHBpk7ri6aYkLVw8M5ob52ZB1r8niPaP9yNwkrOkvvvY94jJAesmdb6ZAagZCWOq8KOF3DHZAcLkVlBDQc8EkY5etYj7OvZBGU4YCsYp4RrihGwFGxZClujH7hY0rIzjZC7vlAZBeB7fdrjQBgfWXhwBVU2cZA3iuJrR7NvcWYcTZCbqdaAkZBK5PHWV9"; // from Meta
const PHONE_NUMBER_ID = "912756295264442"; // from Meta

// Webhook verification
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(403);
  }
});

// Handle incoming messages
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (entry) {
    const from = entry.from;
    const msg = entry.text?.body;

    // Simple rule-based reply (replace with AI later)
    let reply = "Thanks for contacting us!";
    if (msg.toLowerCase().includes("hours")) {
      reply = "We’re open Mon–Sat, 9 AM to 7 PM.";
    }

    // Send reply via Cloud API
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply },
      },
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook running on port 3000"));


