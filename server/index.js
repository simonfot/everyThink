const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve static files from dist directory

// In-memory storage (replace with database in production)
const users = new Map();
const games = new Map();

// Routes
app.post('/api/user', (req, res) => {
    const { did, displayName, avatarURL } = req.body;
    
    if (!did) {
        return res.status(400).json({ error: 'Missing DID' });
    }
    
    users.set(did, {
        displayName,
        avatarURL,
        coins: users.get(did)?.coins || 0,
        createdAt: users.get(did)?.createdAt || new Date()
    });
    
    res.json({ success: true, user: users.get(did) });
});

app.get('/api/user/:did', (req, res) => {
    const { did } = req.params;
    const user = users.get(did);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
});

// Game related endpoints
app.post('/api/games/:gameId/score', (req, res) => {
    const { gameId } = req.params;
    const { did, score } = req.body;
    
    if (!did) {
        return res.status(400).json({ error: 'Missing DID' });
    }
    
    // Get or create game leaderboard
    const leaderboard = games.get(gameId) || new Map();
    
    // Update user's high score
    const currentScore = leaderboard.get(did)?.score || 0;
    if (score > currentScore) {
        leaderboard.set(did, {
            score,
            timestamp: new Date()
        });
        games.set(gameId, leaderboard);
        
        // Award coins for new high score
        const user = users.get(did);
        if (user) {
            user.coins += Math.floor(score / 100); // Example coin reward logic
            users.set(did, user);
        }
    }
    
    res.json({ 
        success: true, 
        newHighScore: score > currentScore,
        coins: users.get(did)?.coins 
    });
});

app.get('/api/games/:gameId/leaderboard', (req, res) => {
    const { gameId } = req.params;
    const leaderboard = games.get(gameId);
    
    if (!leaderboard) {
        return res.json([]);
    }
    
    // Convert leaderboard to array and sort by score
    const scores = Array.from(leaderboard.entries())
        .map(([did, data]) => ({
            did,
            displayName: users.get(did)?.displayName || 'Unknown',
            ...data
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Top 10
    
    res.json(scores);
});

// Token related endpoints (placeholder)
app.post('/api/tokens/reward', async (req, res) => {
    const { did, amount, reason } = req.body;
    
    try {
        // Here you would interact with your smart contract
        // This is a placeholder that just updates the in-memory storage
        const user = users.get(did);
        if (user) {
            user.coins += amount;
            users.set(did, user);
            
            res.json({ 
                success: true, 
                coins: user.coins,
                transaction: {
                    amount,
                    reason,
                    timestamp: new Date()
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error rewarding tokens:', error);
        res.status(500).json({ error: 'Failed to reward tokens' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});