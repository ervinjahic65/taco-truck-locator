const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch locations
app.get('/api/locations', async (req, res) => {
    try {
        const response = await axios.get('https://my.api.mockaroo.com/locations.json', {
            params: {
                key: process.env.API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).send('Error fetching locations');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});