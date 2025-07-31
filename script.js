document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Toggle menu icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    let currentSlide = 0;
    
    // Hide all testimonials except the first one
    function resetSlides() {
        testimonials.forEach((testimonial, index) => {
            if (index !== currentSlide) {
                testimonial.style.display = 'none';
            } else {
                testimonial.style.display = 'block';
            }
        });
    }
    
    // Initialize slider
    resetSlides();
    
    // Show previous slide
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = testimonials.length - 1;
        }
        resetSlides();
    });
    
    // Show next slide
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        if (currentSlide >= testimonials.length) {
            currentSlide = 0;
        }
        resetSlides();
    });
    
    // Auto-slide every 5 seconds
    setInterval(function() {
        currentSlide++;
        if (currentSlide >= testimonials.length) {
            currentSlide = 0;
        }
        resetSlides();
    }, 5000);
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a, .quick-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Form submission
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            const reason = document.getElementById('reason').value;
            
            // Here you would typically send this data to a server
            // For demo purposes, we'll just show an alert
            alert(`Thank you ${name}! Your appointment request for ${date} has been received. We will contact you at ${phone} to confirm your appointment.\n\nFor immediate bookings, please consider using the Google Calendar booking option above.`);
            
            // Reset form
            appointmentForm.reset();
        });
    }
    
    // Add CSS class to Google Calendar button once it's loaded and handle mobile target="_blank"
    window.addEventListener('load', function() {
        handleCalendarDisplay();
        
        setTimeout(function() {
            const gcalButton = document.querySelector('.calendar-button');
            if (gcalButton) {
                gcalButton.classList.add('gcal-appointment-button');
            }
        }, 1000); // Give the Google Calendar script time to initialize
    });
    
    // Handle calendar display based on screen size
    function handleCalendarDisplay() {
        const mobileCalendarLink = document.querySelector('.mobile-calendar-link');
        const desktopCalendarWidget = document.querySelector('.desktop-calendar-widget');
        
        if (window.innerWidth <= 768) {
            // Show mobile link, hide desktop widget
            if (mobileCalendarLink) mobileCalendarLink.style.display = 'block';
            if (desktopCalendarWidget) desktopCalendarWidget.style.display = 'none';
        } else {
            // Show desktop widget, hide mobile link
            if (mobileCalendarLink) mobileCalendarLink.style.display = 'none';
            if (desktopCalendarWidget) desktopCalendarWidget.style.display = 'block';
        }
    }
    
    // Handle window resize to update calendar display
    window.addEventListener('resize', function() {
        handleCalendarDisplay();
    });
    
    // Add fixed header on scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
    
    // Add CSS for mobile menu when active and fixed header
    const style = document.createElement('style');
    style.textContent = `
        nav ul.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: white;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        nav ul.active li {
            margin: 15px 0;
        }
        
        header.fixed {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.95);
        }
        
        .gcal-appointment-button {
            background-color: #4285F4;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-align: center;
            display: inline-block;
            margin-top: 10px;
            cursor: pointer;
        }
        
        .mobile-calendar-link .btn {
            width: 100%;
            text-align: center;
            padding: 15px 20px;
            font-size: 16px;
        }
        
        .mobile-calendar-link .btn i {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
    
    // Auto-update functionality
    const AUTO_UPDATE = {
        VERSION_CHECK_INTERVAL: 60000, // Check every minute
        currentVersion: '1.0.7',
        
        init: function() {
            this.startVersionCheck();
            this.addCacheBustingToLinks();
        },
        
        startVersionCheck: function() {
            // Check for updates periodically
            setInterval(() => {
                this.checkForUpdates();
            }, this.VERSION_CHECK_INTERVAL);
            
            // Initial check after 5 seconds
            setTimeout(() => {
                this.checkForUpdates();
            }, 5000);
        },
        
        checkForUpdates: async function() {
            try {
                const response = await fetch('/version.json?' + Date.now());
                const versionData = await response.json();
                
                if (versionData.version !== this.currentVersion) {
                    console.log('New version available:', versionData.version);
                    this.showUpdateNotification(versionData.version);
                }
            } catch (error) {
                console.log('Failed to check for updates:', error);
            }
        },
        
        showUpdateNotification: function(newVersion) {
            // Check if notification already exists
            if (document.querySelector('#update-notification').style.display !== 'none') {
                return;
            }
            
            const notification = document.getElementById('update-notification');
            const message = document.getElementById('update-message');
            
            message.textContent = `New version ${newVersion} is available! Click to update.`;
            notification.style.display = 'block';
            
            // Add click handler for the entire notification
            notification.onclick = function() {
                AUTO_UPDATE.performUpdate();
            };
        },
        
        performUpdate: function() {
            // Clear all caches and reload
            if ('caches' in window) {
                caches.keys().then(function(names) {
                    for (let name of names) {
                        caches.delete(name);
                    }
                });
            }
            
            // Force hard reload
            window.location.reload(true);
        },
        
        addCacheBustingToLinks: function() {
            // Add cache busting to all internal links
            const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.includes('?')) {
                    link.setAttribute('href', href + '?v=' + this.currentVersion);
                }
            });
        }
    };

    // Initialize auto-update functionality
    AUTO_UPDATE.init();
});