const express = require("express");
const apirouter = express.Router();
const { readFromFile, readAndAppend } = require("../helper/fsUtils");
const { v4: uuidv4 } = require('uuid');  // Ensure this line is correct

// GET endpoint to retrieve all notes
apirouter.get("/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      console.error(`Error reading notes: ${err}`);
      res.status(500).json({ error: "Failed to read notes" });
    });
});

// POST endpoint to add a new note
apirouter.post("/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {  // Ensure title and text are not undefined
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    readAndAppend(newNote, "./db/db.json")
      .then(() => {
        console.info("New note added successfully");
        res.json("Note added successfully 🚀");
      })
      .catch((err) => {
        console.error(`Error appending note: ${err}`);
        res.status(500).json({ error: "Failed to add note" });
      });
  } else {
    console.error("Title and text are required");
    res.status(400).json({ error: "Title and text are required" });
  }
});

module.exports = apirouter;
