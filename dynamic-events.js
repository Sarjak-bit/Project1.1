// Dynamic Events Loading for Club Connect Frontend

document.addEventListener('DOMContentLoaded', function() {
    loadDynamicEvents();
});

// Load events from backend and update the events section
async function loadDynamicEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        if (events.length === 0) {
            return; // Keep existing static events if no dynamic events
        }
        
        const eventsContainer = document.querySelector('.events-container');
        if (!eventsContainer) return;
        
        // Clear existing events and add dynamic ones
        eventsContainer.innerHTML = events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-date">
                    <span class="day">${event.date}</span>
                    <span class="month">${event.month}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p class="event-club">${event.club}</p>
                    <p class="event-time">${event.time}</p>
                    <p class="event-location">${event.location}</p>
                    <p class="event-description">${event.description}</p>
                </div>
            </div>
        `).join('');
        
        // Re-initialize event card animations and click handlers
        initializeEventCards();
        
    } catch (error) {
        console.error('Error loading dynamic events:', error);
        // Keep existing static events on error
    }
}

// Initialize event cards with animations and click handlers
function initializeEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    eventCards.forEach((card, index) => {
        // Reset styles for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(card);
        
        // Add click handler for event details popup
        card.addEventListener('click', function(e) {
            e.preventDefault();
            showEventModal(card);
        });
    });
}

// Show event modal with details
function showEventModal(eventCard) {
    const title = eventCard.querySelector('h3').textContent;
    const club = eventCard.querySelector('.event-club')?.textContent || '';
    const time = eventCard.querySelector('.event-time')?.textContent || '';
    const location = eventCard.querySelector('.event-location')?.textContent || '';
    const desc = eventCard.querySelector('.event-description')?.textContent || '';
    const date = eventCard.querySelector('.event-date .day')?.textContent || '';
    const month = eventCard.querySelector('.event-date .month')?.textContent || '';
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('eventModalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p><strong>Date:</strong> ${date} ${month}</p>
            <p><strong>Club:</strong> ${club}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p>${desc}</p>
            <button class="participate-btn">Participate</button>
        `;
        modal.classList.add('show');
    }
}

// Auto-refresh events every 2 minutes to show new events in real-time
setInterval(loadDynamicEvents, 120000);