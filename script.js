// Get navbar element
const navbar = document.querySelector('nav');

// Change navbar background and update active nav link on scroll (throttled)
let lastActiveSection = null;
let ticking = false;
let sectionPositions = [];

function cacheSectionPositions() {
    const sections = document.querySelectorAll('section');
    sectionPositions = Array.from(sections).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.clientHeight
    }));
}

function handleScroll() {
    // Navbar background
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    const navLinks = document.querySelectorAll('nav ul li a');
    let found = false;
    for (let i = 0; i < sectionPositions.length; i++) {
        const { id, top, height } = sectionPositions[i];
        if (window.scrollY >= (top - height / 3)) {
            if (lastActiveSection !== id) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
                lastActiveSection = id;
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

window.addEventListener('resize', () => {
    cacheSectionPositions();
    handleScroll();
}, { passive: true });

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
cacheSectionPositions();
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
        // Fix: Ensure last card is fully visible
        maxPosition = Math.min(0, sliderContainer.offsetWidth - cards.length * cardWidth);
        updateSliderPosition();
        updateActiveCards();
    }

    function updateSliderPosition() {
        const transform = `translate3d(${currentPosition}px, 0, 0)`;
        if (lastTransform !== transform) {
            sliderContainer.style.transform = transform;
            lastTransform = transform;
        }
    }

    function updateActiveCards() {
        cards.forEach((card, index) => {
            const cardLeft = index * cardWidth + currentPosition;
            const cardRight = cardLeft + cardWidth;
            const containerLeft = 0;
            const containerRight = sliderContainer.offsetWidth;
            
            if (cardRight > containerLeft && cardLeft < containerRight) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPosition < 0) {
                currentPosition += cardWidth;
                updateSliderPosition();
                updateActiveCards();
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentPosition > maxPosition) {
                currentPosition -= cardWidth;
                updateSliderPosition();
                updateActiveCards();
            }
        });
    }

    // Setup slider on load and resize
    if (sliderContainer && cards.length > 0) {
        setupSlider();
        window.addEventListener('resize', setupSlider);
    }

    // Event card animations
    const eventCards = document.querySelectorAll('.event-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const eventObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    eventCards.forEach(card => {
        eventObserver.observe(card);
    });

    // Event Modal functionality
    const eventModal = document.getElementById('eventModal');
    const eventModalBody = document.getElementById('eventModalBody');
    const closeEventModal = document.querySelector('.close-event-modal');

    // Event card click functionality
    eventCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get event details from the card
            const eventTitle = card.querySelector('h3').textContent;
            const eventClub = card.querySelector('.event-club').textContent;
            const eventTime = card.querySelector('.event-time').textContent;
            const eventLocation = card.querySelector('.event-location').textContent;
            const eventDescription = card.querySelector('.event-description').textContent;
            const eventDate = card.querySelector('.event-date');
            const eventDay = eventDate.querySelector('.day').textContent;
            const eventMonth = eventDate.querySelector('.month').textContent;
            
            // Populate modal with event details
            eventModalBody.innerHTML = `
                <h2>${eventTitle}</h2>
                <p><strong>Organized by:</strong> ${eventClub}</p>
                <p><strong>Date:</strong> ${eventDay} ${eventMonth}</p>
                <p><strong>Time:</strong> ${eventTime}</p>
                <p><strong>Location:</strong> ${eventLocation}</p>
                <p><strong>Description:</strong> ${eventDescription}</p>
                <button class="participate-btn">Participate</button>
            `;
            
            // Show the modal
            eventModal.classList.add('show');
            
            // Add click event to the participate button
            const participateBtn = eventModalBody.querySelector('.participate-btn');
            if (participateBtn) {
                participateBtn.addEventListener('click', function() {
                    alert('Thank you for your interest! You have successfully registered for this event.');
                    eventModal.classList.remove('show');
                });
            }
        });
    });

    if (closeEventModal) {
        closeEventModal.addEventListener('click', function() {
            eventModal.classList.remove('show');
        });
    }

    if (eventModal) {
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                eventModal.classList.remove('show');
            }
        });
    }

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
            resetSearchResults();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navSearchBar.classList.contains('active')) {
                navSearchBar.classList.remove('active');
                navSearchInput.value = '';
                resetSearchResults();
            }
        });

        // Enhanced search functionality
        function resetSearchResults() {
            // Reset all search highlights
            document.querySelectorAll('.search-highlight').forEach(el => {
                el.classList.remove('search-highlight');
            });
            
            // Show all elements
            document.querySelectorAll('.club-link, .event-card').forEach(el => {
                el.style.display = '';
                el.style.opacity = '1';
            });
            
            // Remove any search result indicators
            document.querySelectorAll('.search-result-indicator').forEach(el => {
                el.remove();
            });
            
            // Hide search results panel
            hideSearchResultsPanel();
        }

        function highlightSearchTerm(element, searchTerm) {
            if (!searchTerm) return;
            
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                if (regex.test(text)) {
                    const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
                    const span = document.createElement('span');
                    span.innerHTML = highlightedText;
                    textNode.parentNode.replaceChild(span, textNode);
                }
            });
        }

        function smoothScrollToElement(element, offset = 100) {
            const elementTop = element.offsetTop - offset;
            const currentScroll = window.pageYOffset;
            const targetScroll = elementTop;
            const distance = targetScroll - currentScroll;
            const duration = 800;
            const startTime = performance.now();

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }

            function animateScroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeInOutCubic(progress);
                
                window.scrollTo(0, currentScroll + distance * easedProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            }
            
            requestAnimationFrame(animateScroll);
        }

        navSearchInput.addEventListener('input', function() {
            const query = navSearchInput.value.trim().toLowerCase();
            
            if (query.length < 2) {
                resetSearchResults();
                hideSearchResultsPanel();
                return;
            }

            resetSearchResults();
            
            let foundResults = [];
            let bestMatch = null;
            let bestMatchScore = 0;

            // Search through clubs
            document.querySelectorAll('.club-link').forEach(link => {
                const card = link.querySelector('.club-card');
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                let matchScore = 0;
                let isMatch = false;
                
                // Check for exact matches first
                if (name.includes(query)) {
                    matchScore += 10;
                    isMatch = true;
                }
                if (desc.includes(query)) {
                    matchScore += 5;
                    isMatch = true;
                }
                
                // Check for partial word matches
                const queryWords = query.split(' ');
                queryWords.forEach(word => {
                    if (name.includes(word)) matchScore += 3;
                    if (desc.includes(word)) matchScore += 2;
                });
                
                // Special handling for IT Club page content
                if (link.href.includes('leader1.html')) {
                    // Check if query matches IT Club team members
                    const itClubMembers = [
                        'nabin shrestha', 'alex gautam', 'john kandel', 'sanskriti bhusal',
                        'apekshya pandey', 'elis kandel', 'saimon gurung', 'ankit shrestha',
                        'sandhya shrestha', 'pawan poudel sharma', 'sabnam sunar', 'himanshu bharti',
                        'club mentor', 'club coordinator', 'assistant coordinator', 'marketing head',
                        'pr head', 'finance head', 'logistic head', 'technical head', 'social media head',
                        'administrative head', 'boston center for information and technology', 'it club',
                        'hackathon', 'freecodecamp', 'digital bahas', 'tech', 'innovation'
                    ];
                    
                    itClubMembers.forEach(member => {
                        if (member.includes(query) || query.includes(member.split(' ')[0])) {
                            matchScore += 15; // Higher score for IT Club content
                            isMatch = true;
                        }
                    });
                }
                
                if (isMatch) {
                    foundResults.push({ 
                        element: link, 
                        score: matchScore, 
                        type: 'club',
                        title: card.querySelector('h3')?.textContent || '',
                        description: card.querySelector('p')?.textContent || '',
                        url: link.href
                    });
                    if (matchScore > bestMatchScore) {
                        bestMatchScore = matchScore;
                        bestMatch = link;
                    }
                    link.style.display = '';
                    link.style.opacity = '1';
                    highlightSearchTerm(card, query);
                } else {
                    link.style.display = 'none';
                }
            });

            // Search through events
            document.querySelectorAll('.event-card').forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const club = card.querySelector('.event-club')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.event-description')?.textContent.toLowerCase() || '';
                
                let matchScore = 0;
                let isMatch = false;
                
                if (title.includes(query)) {
                    matchScore += 8;
                    isMatch = true;
                }
                if (club.includes(query)) {
                    matchScore += 6;
                    isMatch = true;
                }
                if (desc.includes(query)) {
                    matchScore += 4;
                    isMatch = true;
                }
                
                const queryWords = query.split(' ');
                queryWords.forEach(word => {
                    if (title.includes(word)) matchScore += 2;
                    if (club.includes(word)) matchScore += 2;
                    if (desc.includes(word)) matchScore += 1;
                });
                
                if (isMatch) {
                    foundResults.push({ 
                        element: card, 
                        score: matchScore, 
                        type: 'event',
                        title: card.querySelector('h3')?.textContent || '',
                        description: card.querySelector('.event-club')?.textContent || '',
                        url: null
                    });
                    if (matchScore > bestMatchScore) {
                        bestMatchScore = matchScore;
                        bestMatch = card;
                    }
                    card.style.display = '';
                    card.style.opacity = '1';
                    highlightSearchTerm(card, query);
                } else {
                    card.style.display = 'none';
                }
            });

            // Sort results by score (highest first)
            foundResults.sort((a, b) => b.score - a.score);

            // Show search results panel
            showSearchResultsPanel(foundResults, query);

            // If we found results, scroll to the best match
            if (bestMatch && foundResults.length > 0) {
                // Add a small delay to ensure DOM updates
                setTimeout(() => {
                    smoothScrollToElement(bestMatch, 120);
                }, 100);
            }
        });

        // Add search functionality for IT Club page
        if (window.location.pathname.includes('leader1.html')) {
            const searchInput = document.getElementById('main-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const query = searchInput.value.trim().toLowerCase();
                    
                    if (query.length < 2) {
                        resetSearchResults();
                        hideSearchResultsPanel();
                        return;
                    }

                    resetSearchResults();
                    
                    // Search through IT Club page content
                    const memberCards = document.querySelectorAll('.member-card');
                    const eventSections = document.querySelectorAll('.event-section');
                    let foundResults = [];
                    let bestMatch = null;
                    let bestMatchScore = 0;

                    // Search through member cards
                    memberCards.forEach(card => {
                        const name = card.querySelector('h4')?.textContent.toLowerCase() || '';
                        const role = card.querySelector('p')?.textContent.toLowerCase() || '';
                        
                        let matchScore = 0;
                        let isMatch = false;
                        
                        if (name.includes(query)) {
                            matchScore += 10;
                            isMatch = true;
                        }
                        if (role.includes(query)) {
                            matchScore += 8;
                            isMatch = true;
                        }
                        
                        const queryWords = query.split(' ');
                        queryWords.forEach(word => {
                            if (name.includes(word)) matchScore += 3;
                            if (role.includes(word)) matchScore += 2;
                        });
                        
                        if (isMatch) {
                            foundResults.push({ 
                                element: card, 
                                score: matchScore, 
                                type: 'member',
                                title: card.querySelector('h4')?.textContent || '',
                                description: card.querySelector('p')?.textContent || '',
                                url: null
                            });
                            if (matchScore > bestMatchScore) {
                                bestMatchScore = matchScore;
                                bestMatch = card;
                            }
                            card.style.opacity = '1';
                            highlightSearchTerm(card, query);
                        } else {
                            card.style.opacity = '0.3';
                        }
                    });

                    // Search through event sections
                    eventSections.forEach(section => {
                        const title = section.querySelector('h3')?.textContent.toLowerCase() || '';
                        const desc = section.querySelector('.event-desc p')?.textContent.toLowerCase() || '';
                        
                        let matchScore = 0;
                        let isMatch = false;
                        
                        if (title.includes(query)) {
                            matchScore += 8;
                            isMatch = true;
                        }
                        if (desc.includes(query)) {
                            matchScore += 6;
                            isMatch = true;
                        }
                        
                        const queryWords = query.split(' ');
                        queryWords.forEach(word => {
                            if (title.includes(word)) matchScore += 2;
                            if (desc.includes(word)) matchScore += 1;
                        });
                        
                        if (isMatch) {
                            foundResults.push({ 
                                element: section, 
                                score: matchScore, 
                                type: 'event',
                                title: section.querySelector('h3')?.textContent || '',
                                description: section.querySelector('.event-desc p')?.textContent || '',
                                url: null
                            });
                            if (matchScore > bestMatchScore) {
                                bestMatchScore = matchScore;
                                bestMatch = section;
                            }
                            section.style.opacity = '1';
                            highlightSearchTerm(section, query);
                        } else {
                            section.style.opacity = '0.3';
                        }
                    });

                    // Sort results by score
                    foundResults.sort((a, b) => b.score - a.score);

                    // Show search results panel
                    showSearchResultsPanel(foundResults, query);

                    // If we found results, scroll to the best match
                    if (bestMatch && foundResults.length > 0) {
                        setTimeout(() => {
                            smoothScrollToElement(bestMatch, 120);
                        }, 100);
                    }
                });
            }
        }

        // Search results panel functions
        function showSearchResultsPanel(results, query) {
            // Remove existing panel
            hideSearchResultsPanel();
            
            if (results.length === 0) return;

            const panel = document.createElement('div');
            panel.className = 'search-results-panel';
            panel.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                max-height: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                z-index: 2001;
                overflow: hidden;
                border: 1px solid #e5e7eb;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid #f3f4f6;
                background: #f9fafb;
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
            `;
            header.textContent = `${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`;
            panel.appendChild(header);

            const resultsList = document.createElement('div');
            resultsList.style.cssText = `
                max-height: 320px;
                overflow-y: auto;
            `;

            results.forEach((result, index) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid #f3f4f6;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                `;

                // Add hover effect
                resultItem.addEventListener('mouseenter', () => {
                    resultItem.style.backgroundColor = '#f9fafb';
                });
                resultItem.addEventListener('mouseleave', () => {
                    resultItem.style.backgroundColor = 'transparent';
                });

                // Icon based on type
                const icon = document.createElement('div');
                icon.style.cssText = `
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                `;

                if (result.type === 'club') {
                    icon.style.backgroundColor = '#3b82f6';
                    icon.innerHTML = '<i class="fa-solid fa-users"></i>';
                } else if (result.type === 'event') {
                    icon.style.backgroundColor = '#10b981';
                    icon.innerHTML = '<i class="fa-solid fa-calendar"></i>';
                } else if (result.type === 'member') {
                    icon.style.backgroundColor = '#f59e0b';
                    icon.innerHTML = '<i class="fa-solid fa-user"></i>';
                }

                const content = document.createElement('div');
                content.style.cssText = `
                    flex: 1;
                    min-width: 0;
                `;

                const title = document.createElement('div');
                title.style.cssText = `
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 4px;
                    font-size: 0.9rem;
                `;
                title.textContent = result.title;

                const description = document.createElement('div');
                description.style.cssText = `
                    color: #6b7280;
                    font-size: 0.8rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                `;
                description.textContent = result.description;

                content.appendChild(title);
                content.appendChild(description);

                resultItem.appendChild(icon);
                resultItem.appendChild(content);

                // Click handler
                resultItem.addEventListener('click', () => {
                    if (result.url) {
                        // Navigate to URL with section parameter
                        const searchTerm = query.toLowerCase();
                        let sectionParam = '';
                        
                        // Determine which section to open based on search term
                        if (searchTerm.includes('nabin') || searchTerm.includes('alex') || 
                            searchTerm.includes('john') || searchTerm.includes('sanskriti') ||
                            searchTerm.includes('apekshya') || searchTerm.includes('elis') ||
                            searchTerm.includes('saimon') || searchTerm.includes('ankit') ||
                            searchTerm.includes('sandhya') || searchTerm.includes('pawan') ||
                            searchTerm.includes('sabnam') || searchTerm.includes('himanshu') ||
                            searchTerm.includes('mentor') || searchTerm.includes('coordinator') ||
                            searchTerm.includes('head') || searchTerm.includes('team') ||
                            searchTerm.includes('member')) {
                            sectionParam = '?section=members';
                        } else if (searchTerm.includes('hackathon') || searchTerm.includes('freecodecamp') ||
                                   searchTerm.includes('bahas') || searchTerm.includes('event') ||
                                   searchTerm.includes('past')) {
                            sectionParam = '?section=events';
                        }
                        
                        window.open(result.url + sectionParam, '_blank');
                    } else {
                        // Scroll to element
                        smoothScrollToElement(result.element, 120);
                    }
                    hideSearchResultsPanel();
                    navSearchBar.classList.remove('active');
                    navSearchInput.value = '';
                    resetSearchResults();
                });

                resultsList.appendChild(resultItem);
            });

            panel.appendChild(resultsList);
            document.body.appendChild(panel);

            // Close panel when clicking outside
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target) && e.target !== navSearchInput) {
                    hideSearchResultsPanel();
                    document.removeEventListener('click', closePanel);
                }
            });

            // Close panel on escape
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    hideSearchResultsPanel();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
        }

        function hideSearchResultsPanel() {
            const existingPanel = document.querySelector('.search-results-panel');
            if (existingPanel) {
                existingPanel.remove();
            }
        }
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

    // IT Club Member Slider functionality
    const memberSlider = document.querySelector('.member-slider-container');
    const memberPrev = document.querySelector('.member-prev');
    const memberNext = document.querySelector('.member-next');
    if (memberSlider && memberPrev && memberNext) {
        let scrollAmount = 220; // width of card + gap
        memberPrev.addEventListener('click', function() {
            memberSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        memberNext.addEventListener('click', function() {
            memberSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
});