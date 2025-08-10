document.addEventListener('DOMContentLoaded', function() {
    // Theme Dropdown (System / Light / Dark)
    const root = document.documentElement;
    const switcher = document.querySelector('.theme-switcher');
    const switcherBtn = document.getElementById('themeSwitcherButton');
    const menu = document.getElementById('themeSwitcherMenu');
    const options = menu ? Array.from(menu.querySelectorAll('li[role="menuitemradio"]')) : [];
    const PREF_KEY = 'site-theme'; // values: 'light','dark','system'

    function systemPref() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'; }

    function setTheme(mode){
        if(mode === 'light'){ 
            root.setAttribute('data-theme','light'); 
        }
        else if(mode === 'dark'){ 
            root.setAttribute('data-theme','dark'); 
        }
        else { 
            // system mode - apply actual system preference
            const systemPreference = systemPref();
            root.setAttribute('data-theme', systemPreference);
        }
        // Reflect label
        if(switcher){
            const labelEl = switcher.querySelector('.theme-switcher__label');
            if(labelEl){ labelEl.textContent = mode.charAt(0).toUpperCase()+mode.slice(1); }
            switcher.dataset.mode = mode;
        }
        // Update checked states
        options.forEach(li => {
            const val = li.getAttribute('data-theme-value');
            const active = (mode === 'system' && val === 'system') || (mode !== 'system' && val === mode);
            li.setAttribute('aria-checked', String(active));
            if(active){ li.setAttribute('aria-selected','true'); } else { li.removeAttribute('aria-selected'); }
        });
        localStorage.setItem(PREF_KEY, mode);
        adaptHeroTitle();
    }

    function adaptHeroTitle(){
        const heroTitle = document.querySelector('.hero-title');
        if(!heroTitle) return;
        const isDark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && systemPref()==='dark');
        heroTitle.classList.toggle('hero-title-light', isDark);
        heroTitle.classList.toggle('hero-title-dark', !isDark);
    }

    // Init theme from storage or default system
    const stored = localStorage.getItem(PREF_KEY) || 'system';
    setTheme(stored);

    // Toggle menu visibility
    if(switcherBtn){
        switcherBtn.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            switcherBtn.setAttribute('aria-expanded', String(open));
            if(open){ options[0]?.focus(); }
        });
    }

    // Option selection
    options.forEach(li => {
        li.addEventListener('click', () => { setTheme(li.getAttribute('data-theme-value')); menu.classList.remove('open'); switcherBtn.setAttribute('aria-expanded','false'); switcherBtn.focus(); });
        li.addEventListener('keydown', (e) => {
            const idx = options.indexOf(li);
            if(e.key === 'ArrowDown'){ e.preventDefault(); options[(idx+1)%options.length].focus(); }
            if(e.key === 'ArrowUp'){ e.preventDefault(); options[(idx-1+options.length)%options.length].focus(); }
            if(e.key === 'Home'){ e.preventDefault(); options[0].focus(); }
            if(e.key === 'End'){ e.preventDefault(); options[options.length-1].focus(); }
            if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); li.click(); }
            if(e.key === 'Escape'){ menu.classList.remove('open'); switcherBtn.setAttribute('aria-expanded','false'); switcherBtn.focus(); }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e)=>{ if(menu.classList.contains('open') && !switcher.contains(e.target)){ menu.classList.remove('open'); switcherBtn.setAttribute('aria-expanded','false'); }});

    // Respond to system changes if in system mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>{ 
        const currentMode = localStorage.getItem(PREF_KEY) || 'system';
        if(currentMode === 'system'){ 
            setTheme('system'); // This will apply the new system preference
        }
    });
    adaptHeroTitle();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMain = document.querySelector('.nav-main');
    
    if(mobileMenuBtn && navMain){
        mobileMenuBtn.addEventListener('click', function() {
            navMain.classList.toggle('active');
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.setAttribute('aria-label', 'Close menu');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Close menu when clicking outside or on overlay
        navMain.addEventListener('click', function(event) {
            if (event.target === navMain) {
                navMain.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on menu links
        const menuLinks = navMain.querySelectorAll('.nav-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMain.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMain.classList.contains('active')) {
                navMain.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                mobileMenuBtn.focus();
                document.body.style.overflow = '';
            }
        });
    }
    
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
        currentVersion: '1.0.8',
        
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