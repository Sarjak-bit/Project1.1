// Get navbar element
const navbar = document.querySelector('nav');

// Change navbar background and update active nav link on scroll (throttled)
let lastActiveSection = null;
let ticking = false;

function handleScroll() {
    // Navbar background
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    let found = false;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            const currentId = section.getAttribute('id');
            if (lastActiveSection !== currentId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentId) {
                        link.classList.add('active');
                    }
                });
                lastActiveSection = currentId;
            }
            found = true;
        }
    }
    if (!found && lastActiveSection !== null) {
        navLinks.forEach(link => link.classList.remove('active'));
        lastActiveSection = null;
    }

    // Search icon color
    const navSearchBtn = document.getElementById('nav-search-btn');
    const navSearchIcon = navSearchBtn?.querySelector('svg');
    if (navbar.classList.contains('scrolled')) {
        if (navSearchIcon) navSearchIcon.style.stroke = '#333';
    } else {
        if (navSearchIcon) navSearchIcon.style.stroke = 'white';
    }
}

// Use passive event listeners for scroll
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Initial call
handleScroll();

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
    let lastTransform = null;

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
        const transformValue = `translate3d(${currentPosition}px,0,0)`;
        if (lastTransform !== transformValue) {
            sliderContainer.style.transform = transformValue;
            lastTransform = transformValue;
        }
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

    window.addEventListener('resize', setupSlider, { passive: true });

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

    // Nav search slide functionality
    const navSearchBtn = document.getElementById('nav-search-btn');
    const navSearchBar = document.getElementById('main-search-bar');
    const navSearchInput = document.getElementById('main-search-input');
    const navSearchClose = document.getElementById('main-search-close');

    if (navSearchBtn && navSearchBar && navSearchInput && navSearchClose) {
        function openSearchBar(e) {
            if (e) e.preventDefault();
            navSearchBar.classList.add('active');
            setTimeout(() => navSearchInput.focus(), 100);
        }
        navSearchBtn.addEventListener('click', openSearchBar);
        navSearchBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openSearchBar(e);
            }
        });
        navSearchClose.addEventListener('click', function() {
            navSearchBar.classList.remove('active');
            navSearchInput.value = '';
            // Reset filter
            document.querySelectorAll('.club-link').forEach(link => link.style.display = '');
            document.querySelectorAll('.event-card').forEach(card => card.style.display = '');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navSearchBar.classList.contains('active')) {
                navSearchBar.classList.remove('active');
                navSearchInput.value = '';
                document.querySelectorAll('.club-link').forEach(link => link.style.display = '');
                document.querySelectorAll('.event-card').forEach(card => card.style.display = '');
            }
        });
        // Main search bar filtering
        navSearchInput.addEventListener('input', function() {
            const query = navSearchInput.value.trim().toLowerCase();
            // Filter clubs
            document.querySelectorAll('.club-link').forEach(link => {
                const card = link.querySelector('.club-card');
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (name.includes(query) || desc.includes(query) || query === '') {
                    link.style.display = '';
                } else {
                    link.style.display = 'none';
                }
            });
            // Filter events
            document.querySelectorAll('.event-card').forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const club = card.querySelector('.event-club')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.event-description')?.textContent.toLowerCase() || '';
                if (title.includes(query) || club.includes(query) || desc.includes(query) || query === '') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navList = document.getElementById('nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            const isOpen = hamburger.classList.toggle('open');
            navList.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // Close menu when a nav link is clicked (on mobile)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 900) {
                    hamburger.classList.remove('open');
                    navList.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});