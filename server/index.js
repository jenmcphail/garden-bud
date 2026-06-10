import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ZIP → hardiness zone
async function getHardinessZone(zip) {
    const res = await axios.get(`https://phzmapi.org/${zip}.json`);
    return res.data.zone;
}

// Zone → plant recommendations via Claude
async function getPlantRecommendations(zone, zip) {
    const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
            role: 'user',
            content: `I live in USDA hardiness zone ${zone} (ZIP code ${zip}). 
      Give me exactly 6 plant recommendations for my garden.
      Respond ONLY with a JSON array, no markdown, no explanation. Format:
      [
        {
          "name": "Plant Name",
          "type": "vegetable|herb|flower|shrub",
          "plantingWindow": "e.g. March–May",
          "sunNeeds": "Full Sun|Partial Shade|Full Shade",
          "waterNeeds": "Low|Moderate|High",
          "description": "One sentence about why this plant thrives in your zone."
        }
      ]`
        }]
    });

    const raw = message.content[0].text;
    return JSON.parse(raw);
}

app.post('/api/recommendations', async (req, res) => {
    const { zip } = req.body;

    if (!zip || !/^\d{5}$/.test(zip)) {
        return res.status(400).json({ error: 'Please provide a valid 5-digit ZIP code.' });
    }

    try {
        const zone = await getHardinessZone(zip);
        const plants = await getPlantRecommendations(zone, zip);
        res.json({ zone, plants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));