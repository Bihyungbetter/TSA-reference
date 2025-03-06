/**
 * Time For Thyme Restaurant - Main JavaScript
 * Provides interactive functionality and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initScrollEffects();
    initMenuTabs();
    initScrollAnimation();
    initFormValidation();
    initNewComponents();
    
    // Add fade-in animations to elements with reveal classes
    document.querySelectorAll('.reveal-from-left, .reveal-from-right, .reveal-from-bottom').forEach(el => {
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.closest('section').classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        }).observe(el);
    });
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking a nav link (for mobile)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

/**
 * Scroll effects
 */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        // Add/remove 'scrolled' class to navbar based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Initial check for page refresh
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }
    
    // Smooth scroll to sections when clicking on nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Menu tabs functionality
 */
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                menuTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all menu sections
                document.querySelectorAll('.menu-items').forEach(item => {
                    item.classList.add('hidden');
                });
                
                // Show the selected menu section with animation
                const targetCategory = tab.getAttribute('data-category');
                const targetSection = document.getElementById(targetCategory);
                
                if (targetSection) {
                    targetSection.classList.remove('hidden');
                    
                    // Reset and trigger animations
                    const menuItems = targetSection.querySelectorAll('.menu-item');
                    menuItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.transition = 'all 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100 * index); // Staggered animation
                    });
                }
            });
        });
    }
}

/**
 * Scroll animation for revealing elements
 */
function initScrollAnimation() {
    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger area
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Form validation
 */
function initFormValidation() {
    // Reservation form
    const reservationForm = document.querySelector('.reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            const formData = new FormData(reservationForm);
            let isValid = true;
            let firstInvalidField = null;
            
            // Check required fields
            reservationForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Submit form logic would go here (AJAX request, etc.)
            // For now, just show a success message
            showNotification('Reservation submitted successfully! We will contact you shortly.', 'success');
            reservationForm.reset();
        });
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            const formData = new FormData(contactForm);
            let isValid = true;
            let firstInvalidField = null;
            
            // Check required fields
            contactForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Submit form logic would go here (AJAX request, etc.)
            // For now, just show a success message
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already defined in CSS
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    notification.style.backgroundColor = type === 'success' ? '#3a5a40' : '#d62828';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    
    // Style the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add animation: fade in
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'all 0.3s ease';
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    const removeTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button event
    closeButton.addEventListener('click', () => {
        clearTimeout(removeTimeout);
        removeNotification(notification);
    });
}

/**
 * Remove notification with animation
 */
function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Menu navigation for the separate menu page
 * Handles smooth scrolling and active state for menu categories
 */
function initMenuNavigation() {
    const menuNavLinks = document.querySelectorAll('.menu-nav-link');
    
    if (menuNavLinks.length > 0) {
        // Highlight active menu section on scroll
        const menuSections = document.querySelectorAll('.menu-category');
        
        const highlightCurrentSection = () => {
            let currentSectionId = null;
            
            menuSections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            if (currentSectionId) {
                menuNavLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        };
        
        // Initial check
        highlightCurrentSection();
        
        // Check on scroll
        window.addEventListener('scroll', highlightCurrentSection);
        
        // Smooth scroll with offset for fixed header
        menuNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offset = document.querySelector('.navbar').offsetHeight + 20;
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                    
                    // Add active class to clicked link
                    menuNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Handle initial hash in URL
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            
            if (targetElement) {
                setTimeout(() => {
                    const offset = document.querySelector('.navbar').offsetHeight + 20;
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add active class to corresponding link
                    menuNavLinks.forEach(link => {
                        if (link.getAttribute('href') === window.location.hash) {
                            link.classList.add('active');
                        }
                    });
                }, 100);
            }
        }
    }
}

/**
 * Advanced image handling for responsive loading and effects
 */
function initImageEffects() {
    // Add loading="lazy" attribute to images for better performance
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Menu card image hover effects
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        const image = card.querySelector('.menu-card-image img');
        
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1.0)';
            });
        }
    });
    
    // Team member image effects
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const image = member.querySelector('.team-img');
        const container = member.querySelector('.team-img-container');
        
        if (image && container) {
            container.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            
            container.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1.0)';
            });
        }
    });
}

/**
 * Enhanced scroll animations with parallax and staggered reveals
 */
function initEnhancedAnimations() {
    // Parallax effect for background sections
    const parallaxElements = document.querySelectorAll('.bg-parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const scrollPosition = window.scrollY;
                const speed = element.getAttribute('data-speed') || 0.5;
                element.style.backgroundPositionY = `${scrollPosition * speed}px`;
            });
        });
    }
    
    // Staggered animation for items in sections
    const staggeredSections = document.querySelectorAll('.philosophy-grid, .team-grid, .sustainability-pillars, .certification-grid');
    
    staggeredSections.forEach(section => {
        const items = section.children;
        
        const staggeredObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in-up');
                        }, index * 150); // 150ms delay between each item
                    });
                    staggeredObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        staggeredObserver.observe(section);
    });
    
    // Text reveal animation for story sections
    const storyTextBlocks = document.querySelectorAll('.story-text p, .pillar-content p');
    
    storyTextBlocks.forEach(textBlock => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.innerText;
                    entry.target.innerHTML = '';
                    
                    // Add each letter with a delay
                    text.split('').forEach((letter, index) => {
                        const span = document.createElement('span');
                        span.innerText = letter;
                        span.style.opacity = '0';
                        span.style.display = 'inline-block';
                        
                        entry.target.appendChild(span);
                        
                        setTimeout(() => {
                            span.style.transition = 'opacity 10ms ease';
                            span.style.opacity = '1';
                        }, index * 10); // 10ms delay per letter
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });
        
        observer.observe(textBlock);
    });
}

/**
 * Implement filtering system for menu items
 */
function initMenuFilters() {
    const menuPage = document.querySelector('.menu-page');
    
    if (menuPage) {
        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'menu-filters';
        filterContainer.innerHTML = `
            <div class="container">
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="vegetarian">Vegetarian</button>
                    <button class="filter-btn" data-filter="vegan">Vegan</button>
                    <button class="filter-btn" data-filter="gluten-free">Gluten Free</button>
                </div>
            </div>
        `;
        
        // Add filter container after menu navigation
        const menuNavigation = document.querySelector('.menu-navigation');
        if (menuNavigation) {
            menuNavigation.after(filterContainer);
            
            // Add styles for filters
            const style = document.createElement('style');
            style.textContent = `
                .menu-filters {
                    background-color: var(--matcha-accent);
                    padding: 15px 0;
                    margin-bottom: 40px;
                }
                .filter-buttons {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .filter-btn {
                    background: transparent;
                    border: 2px solid var(--matcha-green);
                    color: var(--matcha-dark);
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .filter-btn:hover, .filter-btn.active {
                    background: var(--matcha-green);
                    color: white;
                }
                .menu-card[data-dietary] {
                    position: relative;
                }
                .dietary-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: var(--matcha-light);
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--matcha-dark);
                    font-size: 12px;
                    z-index: 2;
                }
            `;
            document.head.appendChild(style);
            
            // Add dietary attributes and indicators to menu cards
            // Note: This would normally use real data from the menu items
            // This is a simulation for demonstration purposes
            const menuCards = document.querySelectorAll('.menu-card');
            const dietaryTypes = ['vegetarian', 'vegan', 'gluten-free'];
            const dietaryIcons = {
                'vegetarian': 'V',
                'vegan': 'Ve',
                'gluten-free': 'GF'
            };
            
            menuCards.forEach(card => {
                // Randomly assign dietary attributes (in production, this would be based on actual data)
                if (Math.random() > 0.5) {
                    const randomType = dietaryTypes[Math.floor(Math.random() * dietaryTypes.length)];
                    card.setAttribute('data-dietary', randomType);
                    
                    // Add indicator
                    const indicator = document.createElement('div');
                    indicator.className = 'dietary-icon';
                    indicator.textContent = dietaryIcons[randomType];
                    card.appendChild(indicator);
                }
            });
            
            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Filter menu cards
                    menuCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = '';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            if (card.getAttribute('data-dietary') === filter) {
                                card.style.display = '';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, 50);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        }
                    });
                });
            });
        }
    }
}

/**
 * Implement dark mode toggle
 */
function initDarkMode() {
    // Check if user has a preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Create the toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--matcha-dark);
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .dark-mode-toggle:hover {
            transform: scale(1.1);
        }
        
        body.dark-mode {
            --background-light: #1a1a1a;
            --background-cream: #2a2a2a;
            --text-dark: #f0f0f0;
            --text-medium: #cccccc;
            --text-light: #ffffff;
            --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.5);
            --shadow-medium: 0 8px 16px rgba(0, 0, 0, 0.6);
        }
        
        body.dark-mode .navbar.scrolled {
            background-color: rgba(25, 25, 25, 0.95);
        }
        
        body.dark-mode .menu-card,
        body.dark-mode .philosophy-card,
        body.dark-mode .certification-item,
        body.dark-mode .timeline-content {
            background-color: #2c2c2c;
        }
        
        body.dark-mode .footer {
            background-color: #181818;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toggleBtn);
    
    // Function to toggle dark mode
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'disabled');
        }
    };
    
    // Check local storage for user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (localStorage.getItem('darkMode') === 'disabled') {
        document.body.classList.remove('dark-mode');
    } else if (prefersDarkScheme.matches) {
        // If no local storage setting but user prefers dark mode
        document.body.classList.add('dark-mode');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Add click event
    toggleBtn.addEventListener('click', toggleDarkMode);
}

/**
 * Initialize new components
 */
function initNewComponents() {
    // Check if we're on the menu page
    if (document.querySelector('.menu-page')) {
        initMenuNavigation();
        initMenuFilters();
    }
    
    // Check if we're on the about page
    if (document.querySelector('.about-page')) {
        // Enhanced timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (timelineItems.length > 0) {
            timelineItems.forEach(item => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            item.classList.add('animate-timeline');
                            observer.unobserve(item);
                        }
                    });
                }, { threshold: 0.2 });
                
                observer.observe(item);
            });
        }
    }
    
    // Check if we're on the sustainability page
    if (document.querySelector('.sustainability-page')) {
        // Animate certification logos
        const certItems = document.querySelectorAll('.certification-item');
        
        if (certItems.length > 0) {
            certItems.forEach((item, index) => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                item.classList.add('scale-in');
                            }, index * 200);
                            observer.unobserve(item);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(item);
            });
        }
    }
    
    // Initialize image effects for all pages
    initImageEffects();
    
    // Initialize enhanced animations
    initEnhancedAnimations();
    
    // Initialize dark mode toggle
    initDarkMode();
} 