const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // <-- ADD THIS NEW LINE HERE

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// This line tells your server to host all the HTML files in your 'public' folder!
app.use(express.static(path.join(__dirname, 'public'))); 

// Database Connection (Using XAMPP's default settings)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'anonymous_coders_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// --- API ROUTES ---

// SECURE Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Scramble the password! (10 is the "salt rounds" or complexity)
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) return res.json({ success: false, message: 'Email already exists.' });
            res.json({ success: true, message: 'Securely registered!' });
        });
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
});

// SECURE Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            // Compare the typed password with the scrambled database password
            const match = await bcrypt.compare(password, results[0].password);
            
            if (match) {
                res.json({ success: true, username: results[0].username });
            } else {
                res.json({ success: false, message: 'Incorrect Password!' });
            }
        } else {
            res.json({ success: false, message: 'User not found!' });
        }
    });
});
// --- GET ALL COURSES ROUTE ---
app.get('/api/courses', (req, res) => {
    const sql = 'SELECT * FROM courses';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ success: false, message: 'Failed to fetch courses.' });
        }
        // Sends the list of 12 courses to your website!
        res.json({ success: true, courses: results }); 
    });
});
// Add this in server.js if it's missing or incorrect
app.get('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    const sql = 'SELECT * FROM courses WHERE id = ?';
    
    db.query(sql, [courseId], (err, result) => {
        if (err || result.length === 0) {
            return res.json({ success: false, message: 'Course not found.' });
        }
        res.json({ success: true, course: result[0] }); 
    });
});
// Route to handle Contact Form submissions
app.post('/api/contact', (req, res) => {
    // 1. Grab the data sent from the frontend
    const { name, email, subject, message } = req.body;
    
    // 2. Prepare the SQL query
    const sql = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    
    // 3. Execute the query
    db.query(sql, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        console.log("New message saved to database!");
        res.json({ success: true });
    });
});
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
