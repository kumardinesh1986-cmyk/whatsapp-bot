const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "Hey Man!!"; // choose any string
const ACCESS_TOKEN = "EAAyQo0ya3xsBQ5YgrAds9PmrVMmsksfKetsyHYZCuXvSvYQhLJBi4jgc7ZAPmwa2aFaBg9ANtkiZCrLRdq79nPmOxzbkU1sr9c6ZCPCM45UKaCIZBCek3PaxZAssmzk199MipEN5UiRK7QIGoZAFinJupInreCvp27DXcK331kIKm9rFw4ZAtMfFrynTxZBkcSfGYPI1ONslyFNhtNJiuYFKBCT3ZB9rPdJbbZB0cTM3vhMRIea5IEwxbxIuQmYbCAJmPSGO0fC5ZBOrvQ8SZBv0LnJfmnwZDZD"; // from Meta
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

