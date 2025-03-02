const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to log user visits
app.use((req, res, next) => {
    const logEntry = {
        ip: req.ip,
        time: new Date().toISOString(),
        method: req.method,
        url: req.url
    };
    fs.appendFile('visits.log', JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
    next();
});

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to retrieve logs
app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read log file' });
        }
        const logs = data.split('\n').filter(line => line).map(JSON.parse);
        res.json(logs);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});