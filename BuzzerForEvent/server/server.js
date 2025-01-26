const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/buzzerDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// MongoDB Schemas and Models
const buzzerSchema = new mongoose.Schema({
  teamName: String,
  timeTaken: Number,
  pressedAt: { type: Date, default: Date.now },
});

const BuzzerEntry = mongoose.model("BuzzerEntry", buzzerSchema);

const stateSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  startTime: { type: Date, default: null },
});

const BuzzerState = mongoose.model("BuzzerState", stateSchema);

const teamSchema = new mongoose.Schema({
  teamName: { type: String, unique: true },
});

const RegisteredTeam = mongoose.model("RegisteredTeam", teamSchema);

// Initialize buzzer state (run only once)
BuzzerState.findOne().then((state) => {
  if (!state) {
    const initialState = new BuzzerState({ isActive: false, startTime: null });
    initialState.save();
  }
});

// API Routes

// Register a team
app.post("/register", async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).send("Team name is required.");
  }

  try {
    const newTeam = new RegisteredTeam({ teamName });
    await newTeam.save();
    res.status(200).send("Team registered successfully.");
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("Team name already exists.");
    } else {
      res.status(500).send("Error registering team: " + err.message);
    }
  }
});

// Activate the buzzer
app.post("/activate", async (req, res) => {
  try {
    const state = await BuzzerState.findOne();
    state.isActive = true;
    state.startTime = new Date();
    await state.save();

    // Clear previous buzzer entries
    await BuzzerEntry.deleteMany({});
    res.status(200).send("Buzzer activated. Timer started.");
  } catch (err) {
    res.status(500).send("Error activating buzzer: " + err.message);
  }
});

// Deactivate the buzzer
app.post("/deactivate", async (req, res) => {
  try {
    const state = await BuzzerState.findOne();
    state.isActive = false;
    state.startTime = null;
    await state.save();
    res.status(200).send("Buzzer deactivated. Timer reset.");
  } catch (err) {
    res.status(500).send("Error deactivating buzzer: " + err.message);
  }
});

// Record a buzz
app.post("/buzz", async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).send("Team name is required.");
  }

  const state = await BuzzerState.findOne();
  if (!state.isActive) {
    return res.status(403).send("The buzzer is inactive.");
  }

  const teamAlreadyBuzzed = await BuzzerEntry.findOne({ teamName });
  if (teamAlreadyBuzzed) {
    return res.status(403).send("This team has already pressed the buzzer.");
  }

  const timeTaken = (new Date() - state.startTime) / 1000; // Calculate time in seconds

  try {
    const newEntry = new BuzzerEntry({ teamName, timeTaken });
    await newEntry.save();
    res.status(200).send(`Buzz recorded successfully! Time: ${timeTaken.toFixed(2)} seconds.`);
  } catch (err) {
    res.status(500).send("Error recording buzz: " + err.message);
  }
});

// Retrieve leaderboard entries
app.get("/entries", async (req, res) => {
  try {
    const entries = await BuzzerEntry.find().sort({ timeTaken: 1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).send("Error retrieving entries: " + err.message);
  }
});

// Retrieve registered teams
app.get("/teams", async (req, res) => {
  try {
    const teams = await RegisteredTeam.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).send("Error retrieving teams: " + err.message);
  }
});

// Serve frontend files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/register.html"));
});

app.get("/buzzer", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/buzzer.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/admin.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
