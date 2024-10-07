import express from "express";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

const CREDENTIALS_PATH = path.join(process.cwd(), "client_id.json");

let credentials;

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error("Error loading client secret file:", err);
  credentials = JSON.parse(content);

  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  app.get("/", (req, res) => {
    res.send("Hello! This is your event platform server.");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
