// Admin Dashboard JavaScript

let currentEditEventId = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    loadClubs();
    setupEventForm();
    setupClubForm();
    setupEditForm();
});

// Tab switching functionality
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
    
    // Load appropriate data
    if (tab === 'events') {
        loadEvents();
    } else if (tab === 'clubs') {
        loadClubs();
    }
}

// Load and display events
async function loadEvents() {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading events...</div>';
    
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        if (events.length === 0) {
            eventsList.innerHTML = '<div class="loading">No events found. Create your first event!</div>';
            return;
        }
        
        eventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <img src="${event.image_url || '/clubs/default.webp'}" alt="${event.title}" class="event-image">
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div><strong>Club:</strong> ${event.club}</div>
                        <div><strong>Date:</strong> ${event.date} ${event.month}</div>
                        <div><strong>Time:</strong> ${event.time}</div>
                        <div><strong>Location:</strong> ${event.location}</div>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-actions">
                        <button class="action-btn edit-btn" onclick="editEvent(${event.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteEvent(${event.id}, '${event.title}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = '<div class="loading">Error loading events. Please try again.</div>';
    }
}

// Load and display clubs
async function loadClubs() {
    const clubsList = document.getElementById('clubs-list');
    clubsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading clubs...</div>';
    
    try {
        const response = await fetch('/api/clubs');
        const clubs = await response.json();
        
        if (clubs.length === 0) {
            clubsList.innerHTML = '<div class="loading">No clubs found. Create your first club!</div>';
            return;
        }
        
        clubsList.innerHTML = clubs.map(club => `
            <div class="event-item">
                <img src="${club.image_url || '/clubs/default.webp'}" alt="${club.name}" class="event-image">
                <div class="event-content">
                    <h3 class="event-title">${club.name}</h3>
                    <div class="event-meta">
                        <div><strong>Leader Page:</strong> ${club.leader_page || 'Not set'}</div>
                        <div><strong>Created:</strong> ${new Date(club.created_at).toLocaleDateString()}</div>
                    </div>
                    <p class="event-description">${club.description}</p>
                    <div class="event-actions">
                        <button class="action-btn edit-btn" onclick="editClub(${club.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteClub(${club.id}, '${club.name}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading clubs:', error);
        clubsList.innerHTML = '<div class="loading">Error loading clubs. Please try again.</div>';
    }
}

// Setup event form submission
function setupEventForm() {
    const form = document.getElementById('event-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        
        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showNotification('Event created successfully!', 'success');
                form.reset();
                loadEvents();
            } else {
                const error = await response.json();
                showNotification('Error creating event: ' + error.error, 'error');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            showNotification('Error creating event. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Create Event';
            submitBtn.disabled = false;
        }
    });
}

// Setup club form submission
function setupClubForm() {
    const form = document.getElementById('club-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        
        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/clubs', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showNotification('Club created successfully!', 'success');
                form.reset();
                loadClubs();
            } else {
                const error = await response.json();
                showNotification('Error creating club: ' + error.error, 'error');
            }
        } catch (error) {
            console.error('Error creating club:', error);
            showNotification('Error creating club. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Create Club';
            submitBtn.disabled = false;
        }
    });
}

// Setup edit form submission
function setupEditForm() {
    const form = document.getElementById('edit-event-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const eventId = document.getElementById('edit-event-id').value;
        const submitBtn = form.querySelector('.submit-btn');
        
        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                body: formData
            });
            
            if (response.ok) {
                showNotification('Event updated successfully!', 'success');
                closeEditModal();
                loadEvents();
            } else {
                const error = await response.json();
                showNotification('Error updating event: ' + error.error, 'error');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            showNotification('Error updating event. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Event';
            submitBtn.disabled = false;
        }
    });
}

// Edit event functionality
async function editEvent(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        const event = await response.json();
        
        // Populate edit form
        document.getElementById('edit-event-id').value = event.id;
        document.getElementById('edit-event-title').value = event.title;
        document.getElementById('edit-event-club').value = event.club;
        document.getElementById('edit-event-date').value = event.date;
        document.getElementById('edit-event-month').value = event.month;
        document.getElementById('edit-event-time').value = event.time;
        document.getElementById('edit-event-location').value = event.location;
        document.getElementById('edit-event-description').value = event.description;
        
        // Show modal
        document.getElementById('edit-modal').classList.add('show');
        currentEditEventId = eventId;
    } catch (error) {
        console.error('Error loading event for edit:', error);
        showNotification('Error loading event details.', 'error');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
    currentEditEventId = null;
}

// Delete event
async function deleteEvent(eventId, eventTitle) {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Event deleted successfully!', 'success');
            loadEvents();
        } else {
            const error = await response.json();
            showNotification('Error deleting event: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error deleting event. Please try again.', 'error');
    }
}

// Delete club (placeholder - you can implement similar to deleteEvent)
async function deleteClub(clubId, clubName) {
    if (!confirm(`Are you sure you want to delete "${clubName}"? This action cannot be undone.`)) {
        return;
    }
    
    // Implement delete club API call here
    showNotification('Club deletion not implemented yet.', 'error');
}

// Edit club (placeholder - you can implement similar to editEvent)
function editClub(clubId) {
    showNotification('Club editing not implemented yet.', 'error');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// File upload preview functionality
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const label = this.parentElement.querySelector('.file-upload-label span');
        if (this.files.length > 0) {
            label.textContent = `Selected: ${this.files[0].name}`;
        }
    });
});

// Modal click outside to close
document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape' && document.getElementById('edit-modal').classList.contains('show')) {
        closeEditModal();
    }
});

// Auto-refresh events every 30 seconds to see real-time updates
setInterval(() => {
    const activeTab = document.querySelector('.tab.active').textContent;
    if (activeTab.includes('Events')) {
        loadEvents();
    } else if (activeTab.includes('Clubs')) {
        loadClubs();
    }
}, 30000);