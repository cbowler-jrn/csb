const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Endpoint to save form data
app.post("/save-data", (req, res) => {
  const formData = req.body;

  // Read existing data from the JSON file (if it exists)
  let existingData = [];
  const filePath = path.join(__dirname, "data.json");

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    existingData = JSON.parse(fileContent);
  }

  // Add new data to the existing data
  existingData.push(formData);

  // Write updated data back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  // Send a response to the client
  res.json({ message: "Data saved successfully!" });
});

// Endpoint to read the contents of data.json
app.get("/get-data", (req, res) => {
  const filePath = path.join(__dirname, "data.json");

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  // Read the file and send its contents
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    // Parse the JSON data and send it as a response
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
