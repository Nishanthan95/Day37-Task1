const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Folder to store the files
const folderPath = path.join(__dirname, 'files'); 

// Ensure the directory exists
if (!fs.existsSync(folderPath)) {
    try {
        fs.mkdirSync(folderPath, { recursive: true });
    } catch (err) {
        console.error('Error creating directory:', err);
        process.exit(1); // Exit if the directory can't be created
    }
}

// Function to sanitize timestamp for use in filenames
function sanitizeTimestamp(timestamp) {
    return timestamp.replace(/:/g, '-'); // Replaces all colons with hyphens
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    let timestamp = new Date().toISOString();
    const sanitizedTimestamp = sanitizeTimestamp(timestamp);
    const filename = `${sanitizedTimestamp}.txt`;
    const filePath = path.join(folderPath, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send(`Error writing file: ${err.message}`);
        }
        res.send(`File created: ${filename}`);
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send(`Error reading directory: ${err.message}`);
        }
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.json(textFiles);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
