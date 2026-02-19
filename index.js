const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "Hey Man!!"; // choose any string
const ACCESS_TOKEN = "EAAyQo0ya3xsBQZCYSWNfDFFURCjZBYNZAxjVL8xD62U70kZCWZAFgkIm3x8hBxPJnbRtfeRJlZCt962Na3BJjEXDIA9hOs58ZCkoF2nCw7b9BEht9r4d5OEiFYOzm3wlxTP1vxYZBrK53mLtB0cuZBM9ZAOEJIWbbPCSx7i55pbivmwnGRujDMG4TcrNIvaXE7ndL37ZAZCftPz9gQIGmHtY60ziZCR8wZBGr3ZAT5fvBiVQZBl3pA0JmJQmsIH5D3lR3PnjttGawzYuabaEDvuZA6m6BUjW46gZDZD"; // from Meta
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
