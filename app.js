//require necessary modules
require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json());

//array to push new users
const users = [];

//register new user and check if user already exists or not
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists.' });
    }
    
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully.' });
});

//login for users and check for invalid username and password
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }
    
    // Generate JWT token
    const accesstoken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' });
    res.json({ accesstoken });
});

//to generate new token 
app.post('/refresh', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token is required.' });
    }
    
    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        // Generate new token with extended expiration time
        const newToken = jwt.sign({ id: decoded.id, username: decoded.username }, secretKey, { expiresIn: '10m' });
        res.json({ token: newToken });
    });
});

//user authentication
function authenticateToken(req, res, next){
    const authHeader =  req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })
}

//a test function to check if authorized user has entered
app.get('/test', authenticateToken, (req, res) => {
   res.json({user: req.user, test: 'Only authorized users'});
});

app.listen(4000)