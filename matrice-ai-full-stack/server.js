// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

const mongoConnectionString = 'mongodb+srv://ralka4776:TMRsa4M5wnRfTl29@alka.v2142kr.mongodb.net/';

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

app.use(bodyParser.json());
app.use(cors());

const User = mongoose.model('User', {
    username: String,
    password: String,
    interviews: [
        {
            name: String,
            status: String,
            feedback: String,
            rating: Number,
        },
    ],
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Signin successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addInterview/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, status, feedback, rating } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.interviews.push({ name, status, feedback, rating });
        await user.save();

        res.status(200).json({ message: 'Interview added successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/interviews/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ interviews: user.interviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route to handle DELETE requests for deleting interviews
app.delete('/deleteInterview/:userId/:interviewId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const interviewId = req.params.interviewId;

        console.log(`Deleting interview with ID: ${interviewId} for user with ID: ${userId}`);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User's interviews before deletion: ${JSON.stringify(user.interviews)}`);

        user.interviews = user.interviews.filter(interview => interview._id.toString() !== interviewId);

        console.log(`User's interviews after deletion: ${JSON.stringify(user.interviews)}`);

        await user.save();

        res.status(200).json({ message: 'Interview deleted successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
