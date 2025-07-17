// Get navbar element
const navbar = document.querySelector('nav');

// Change navbar background on scroll
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Update active navigation link
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            const currentId = section.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Clubs slider functionality
// Only for sliding cards, not for modal or card click
// No custom click events for club cards

document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.club-card');
    
    let currentPosition = 0;
    let cardWidth;
    const cardsPerView = 4;
    let maxPosition;

    function setupSlider() {
        cardWidth = cards[0].offsetWidth + 20;
        maxPosition = -(cards.length - cardsPerView) * cardWidth;
        updateSliderPosition();
        updateActiveCards();
    }

    setTimeout(setupSlider, 100);

    nextBtn.addEventListener('click', function() {
        if (currentPosition > maxPosition) {
            currentPosition -= cardWidth;
            updateSliderPosition();
            updateActiveCards();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPosition < 0) {
            currentPosition += cardWidth;
            updateSliderPosition();
            updateActiveCards();
        }
    });

    function updateSliderPosition() {
        sliderContainer.style.transform = `translateX(${currentPosition}px)`;
        prevBtn.style.opacity = currentPosition < 0 ? '1' : '0.5';
        nextBtn.style.opacity = currentPosition > maxPosition ? '1' : '0.5';
    }

    function updateActiveCards() {
        cards.forEach((card, i) => {
            if (i >= Math.abs(currentPosition / cardWidth) && i < Math.abs(currentPosition / cardWidth) + cardsPerView) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    window.addEventListener('resize', setupSlider);

    // Event cards animation
    const eventCards = document.querySelectorAll('.event-card');
    
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
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
        // Popup for event details
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const title = card.querySelector('h3').textContent;
            const club = card.querySelector('.event-club')?.textContent || '';
            const time = card.querySelector('.event-time')?.textContent || '';
            const location = card.querySelector('.event-location')?.textContent || '';
            const desc = card.querySelector('.event-description')?.textContent || '';
            const date = card.querySelector('.event-date .day')?.textContent || '';
            const month = card.querySelector('.event-date .month')?.textContent || '';
            const modal = document.getElementById('eventModal');
            const modalBody = document.getElementById('eventModalBody');
            modalBody.innerHTML = `
                <h2>${title}</h2>
                <p><strong>Date:</strong> ${date} ${month}</p>
                <p><strong>Club:</strong> ${club}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p>${desc}</p>
            `;
            modal.classList.add('show');
        });
    });

    // Close event modal
    const eventModal = document.getElementById('eventModal');
    const closeEventModal = document.querySelector('.close-event-modal');
    closeEventModal.addEventListener('click', function() {
        eventModal.classList.remove('show');
    });
    eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            eventModal.classList.remove('show');
        }
    });
});