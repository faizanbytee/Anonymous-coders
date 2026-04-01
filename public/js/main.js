(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });


    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

})(jQuery);
// --- GLOBAL DARK MODE LOGIC ---
const body = document.body;
const savedTheme = localStorage.getItem('site-theme'); // Checks browser memory

// 1. Apply theme instantly on ALL pages when they load
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

// 2. Find the button and icon on the current page
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggleBtn && themeIcon) {
    // Make sure the icon matches the saved theme on page load
    if (savedTheme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Listen for the button click
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save the choice and swap the icon
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('site-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('site-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
// 1. Wait for the form to be submitted
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    // 2. Stop the page from refreshing!
    event.preventDefault(); 
    
    // 3. Gather the data from the input IDs we created
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    try {
        // 4. Send the data to our Node.js server
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        // 5. Success Check!
        if (result.success) {
            alert("Message sent successfully! We will get back to you soon.");
            this.reset(); // Clears all the input boxes
        } else {
            alert("Oops! Something went wrong on the server.");
        }
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Could not connect to the server.");
    }
});
}





