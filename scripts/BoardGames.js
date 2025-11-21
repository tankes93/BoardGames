$(document).ready(function() {
    // Search functionality with touch support
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');
    
    function performSearch() {
        var value = $("#searchInput").val().toLowerCase();
        $(".searchLink").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }
    
    $("#searchInput").on("keyup", performSearch);
    
    if (searchSubmit) {
        InputHandler.onClick(searchSubmit, function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    // Add smooth scroll
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Add particle effect on mouse move (desktop only)
    if (ResponsiveUtils.device.isDesktop) {
        let mouseX = 0;
        let mouseY = 0;

        $(document).mousemove(function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });
    }

    // Parallax effect for hero section (disable on mobile for performance)
    if (!ResponsiveUtils.device.isMobile) {
        $(window).scroll(function() {
            var scrolled = $(window).scrollTop();
            $('.hero-content').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
        });
    }
    
    // Make game cards touch-friendly
    $('.searchLink').each(function() {
        InputHandler.onClick(this, function(e) {
            // Let the default link behavior work
        }, {
            preventDefault: false
        });
    });
    
    // Scroll animation for game cards
    function animateOnScroll() {
        const gameCards = document.querySelectorAll('.searchLink');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        gameCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // Initialize animations
    animateOnScroll();
});
