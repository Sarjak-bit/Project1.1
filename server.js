const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session middleware for admin panel
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Database setup
const db = new sqlite3.Database('./database.db');

// Initialize database tables
db.serialize(() => {
    // Events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        club TEXT NOT NULL,
        date TEXT NOT NULL,
        month TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Clubs table
    db.run(`CREATE TABLE IF NOT EXISTS clubs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        leader_page TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default admin user (password: admin123)
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)`, 
           ['admin', defaultPassword]);

    // Insert sample data if tables are empty
    db.get("SELECT COUNT(*) as count FROM events", (err, row) => {
        if (row.count === 0) {
            const sampleEvents = [
                {
                    title: "IT Innovation Seminar",
                    club: "Boston Center for Information and Technology",
                    date: "15",
                    month: "MAR",
                    time: "⏰ 2:00 PM - 4:00 PM",
                    location: "📍 Room 301, Computer Lab",
                    description: "Explore the latest trends in technology and innovation.",
                    image_url: "/clubs/IT.webp"
                },
                {
                    title: "Entrepreneurship Workshop",
                    club: "Boston Center for Entrepreneurship and Leadership",
                    date: "22",
                    month: "MAR",
                    time: "⏰ 10:00 AM - 1:00 PM",
                    location: "📍 Main Auditorium",
                    description: "Learn how to start and lead your own business.",
                    image_url: "/clubs/Entrepreneurship.webp"
                },
                {
                    title: "Spring Music Concert",
                    club: "Boston Center for Music and Arts",
                    date: "29",
                    month: "MAR",
                    time: "⏰ 6:00 PM - 8:00 PM",
                    location: "📍 Auditorium",
                    description: "Live performances by music and arts club members.",
                    image_url: "/clubs/Music.webp"
                }
            ];

            sampleEvents.forEach(event => {
                db.run(`INSERT INTO events (title, club, date, month, time, location, description, image_url) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                       [event.title, event.club, event.date, event.month, event.time, event.location, event.description, event.image_url]);
            });
        }
    });

    db.get("SELECT COUNT(*) as count FROM clubs", (err, row) => {
        if (row.count === 0) {
            const sampleClubs = [
                {
                    name: "Boston Center for Information and Technology",
                    description: "Explore technology and innovation",
                    image_url: "/clubs/IT.webp",
                    leader_page: "leaders/leader1.html"
                },
                {
                    name: "Boston Center for Entrepreneurship and Leadership",
                    description: "Develop entrepreneurial skills",
                    image_url: "/clubs/Entrepreneurship.webp",
                    leader_page: "leaders/leader2.html"
                },
                {
                    name: "Boston Center for Music and Arts",
                    description: "Express yourself through music and arts",
                    image_url: "/clubs/Music.webp",
                    leader_page: "leaders/leader3.html"
                }
            ];

            sampleClubs.forEach(club => {
                db.run(`INSERT INTO clubs (name, description, image_url, leader_page) 
                       VALUES (?, ?, ?, ?)`,
                       [club.name, club.description, club.image_url, club.leader_page]);
            });
        }
    });
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Session-based auth for admin panel
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Routes

// API Routes - Events
app.get('/api/events', (req, res) => {
    db.all("SELECT * FROM events ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json(row);
    });
});

app.post('/api/events', upload.single('image'), (req, res) => {
    const { title, club, date, month, time, location, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(`INSERT INTO events (title, club, date, month, time, location, description, image_url) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
           [title, club, date, month, time, location, description, image_url],
           function(err) {
               if (err) {
                   res.status(500).json({ error: err.message });
                   return;
               }
               res.json({
                   id: this.lastID,
                   title,
                   club,
                   date,
                   month,
                   time,
                   location,
                   description,
                   image_url
               });
           });
});

app.put('/api/events/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, club, date, month, time, location, description } = req.body;
    
    // First get the current event to preserve image if no new image uploaded
    db.get("SELECT image_url FROM events WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const image_url = req.file ? `/uploads/${req.file.filename}` : row.image_url;
        
        db.run(`UPDATE events SET title = ?, club = ?, date = ?, month = ?, time = ?, location = ?, description = ?, image_url = ? 
               WHERE id = ?`,
               [title, club, date, month, time, location, description, image_url, id],
               function(err) {
                   if (err) {
                       res.status(500).json({ error: err.message });
                       return;
                   }
                   res.json({ 
                       id, 
                       title, 
                       club, 
                       date, 
                       month, 
                       time, 
                       location, 
                       description, 
                       image_url 
                   });
               });
    });
});

app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM events WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    });
});

// API Routes - Clubs
app.get('/api/clubs', (req, res) => {
    db.all("SELECT * FROM clubs ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/clubs', upload.single('image'), (req, res) => {
    const { name, description, leader_page } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(`INSERT INTO clubs (name, description, image_url, leader_page) 
           VALUES (?, ?, ?, ?)`,
           [name, description, image_url, leader_page],
           function(err) {
               if (err) {
                   res.status(500).json({ error: err.message });
                   return;
               }
               res.json({
                   id: this.lastID,
                   name,
                   description,
                   image_url,
                   leader_page
               });
           });
});

// Auth Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
        req.session.user = { id: user.id, username: user.username };
        res.json({ token, user: { id: user.id, username: user.username } });
    });
});

// Admin Panel Routes
app.get('/admin/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/admin/dashboard');
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password_hash)) {
            res.redirect('/admin/login?error=1');
            return;
        }
        
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/admin/dashboard');
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
    console.log(`🚀 Club Connect server running on http://localhost:${PORT}`);
    console.log(`📱 Admin panel: http://localhost:${PORT}/admin/login`);
    console.log(`🔑 Default admin credentials: admin / admin123`);
});