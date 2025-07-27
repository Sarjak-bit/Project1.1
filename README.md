# 🎯 Club Connect - Dynamic Event Management System

Transform your static Club Connect website into a dynamic platform where you can manage events like posting on Facebook or Instagram!

## ✨ What This System Does

- **📱 Admin Panel**: User-friendly interface to create, edit, and delete events
- **🔄 Dynamic Content**: Events automatically appear on your website without editing HTML
- **📸 Image Upload**: Upload event images just like social media
- **⚡ Real-time Updates**: Changes appear immediately on your website
- **🗄️ Database Storage**: All events stored in SQLite database
- **🔐 Secure Admin Access**: Protected admin panel with authentication

## 🚀 Quick Start

### Option 1: Using the Startup Script (Recommended)
```bash
./start.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start the server
node server.js
```

## 📋 Access Your System

Once running, you can access:

- **🌐 Your Website**: http://localhost:3000
- **🔧 Admin Panel**: http://localhost:3000/admin/login
- **🔑 Login Credentials**: 
  - Username: `admin`
  - Password: `admin123`

## 🎮 How to Use the Admin Panel

### 1. Login to Admin Panel
1. Go to http://localhost:3000/admin/login
2. Enter credentials: `admin` / `admin123`
3. Click "Login to Dashboard"

### 2. Create a New Event (Like Posting on Social Media!)
1. Fill out the event form:
   - **Event Title**: Name of your event
   - **Club**: Select which club is hosting
   - **Date & Month**: When the event happens
   - **Time**: Event timing (e.g., "⏰ 2:00 PM - 4:00 PM")
   - **Location**: Where it takes place (e.g., "📍 Room 301")
   - **Description**: Tell people about the event
   - **Image**: Upload an event poster/image

2. Click "Create Event" and it will instantly appear on your website!

### 3. Edit or Delete Events
- Click the "Edit" button to modify any event
- Click the "Delete" button to remove events
- Changes appear immediately on your website

### 4. Manage Clubs
- Switch to the "Manage Clubs" tab
- Add new clubs with images and descriptions

## 📁 Project Structure

```
club-connect/
├── server.js              # Backend server
├── package.json           # Dependencies
├── database.db           # SQLite database (auto-created)
├── uploads/              # Event images storage
├── public/               # Admin panel files
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   └── admin-script.js
├── index.html            # Your main website
├── script.js             # Original website JS
├── dynamic-events.js     # Dynamic event loading
├── style.css             # Website styles
├── clubs/               # Club images
└── start.sh             # Easy startup script
```

## 🔧 Technical Features

### Backend (Node.js + Express)
- RESTful API endpoints for events and clubs
- SQLite database for data storage
- File upload handling with Multer
- Session-based authentication
- CORS enabled for frontend integration

### Frontend Integration
- Automatic event loading from database
- Maintains your existing design
- Real-time updates every 2 minutes
- Fallback to static events if backend unavailable

### API Endpoints
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create new club

## 🛠️ Customization

### Change Admin Password
1. Edit `server.js`
2. Find the line with `bcrypt.hashSync('admin123', 10)`
3. Replace 'admin123' with your desired password
4. Restart the server

### Add More Clubs
1. Go to admin panel
2. Click "Manage Clubs" tab
3. Fill out club form and upload image

### Styling
- Edit `style.css` for website styling
- Edit admin panel styles in `public/admin-dashboard.html`

## 🐛 Troubleshooting

### Server Won't Start
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Run `npm install` to install dependencies

### Can't Access Admin Panel
- Make sure server is running
- Try clearing browser cache
- Check browser console for errors

### Events Not Showing
- Check if `dynamic-events.js` is loaded in `index.html`
- Open browser developer tools and check for JavaScript errors
- Verify API endpoint is working: http://localhost:3000/api/events

### Images Not Uploading
- Check `uploads/` directory exists and is writable
- Verify file size is under 5MB
- Only JPG, PNG, GIF, and WebP files are allowed

## 🎉 Success! 

You now have a dynamic event management system! You can:
- ✅ Add events through a beautiful admin panel
- ✅ Upload images like social media
- ✅ Edit and delete events instantly
- ✅ See changes on your website immediately
- ✅ No more manual HTML editing!

Your Club Connect website is now powered by a backend system that makes managing events as easy as posting on Facebook or Instagram! 🚀

## 📞 Need Help?

If you encounter any issues:
1. Check the console output for error messages
2. Verify all files are in the correct locations
3. Make sure the server is running on port 3000
4. Check that your browser allows JavaScript

Happy event managing! 🎊