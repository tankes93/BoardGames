/**
 * Responsive Utilities for Cross-Device Compatibility
 * Handles responsive layouts, viewport management, and device detection
 */

const ResponsiveUtils = (function() {
    'use strict';

    // Device detection
    const device = {
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /(iPad|Android(?!.*Mobile))/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };

    // Breakpoints (matches Bootstrap 3)
    const breakpoints = {
        xs: 0,
        sm: 768,
        md: 992,
        lg: 1200
    };

    /**
     * Get current breakpoint
     */
    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width >= breakpoints.lg) return 'lg';
        if (width >= breakpoints.md) return 'md';
        if (width >= breakpoints.sm) return 'sm';
        return 'xs';
    }

    /**
     * Check if viewport matches breakpoint
     */
    function matchesBreakpoint(bp) {
        const width = window.innerWidth;
        if (typeof bp === 'string') {
            return width >= breakpoints[bp];
        }
        return width >= bp;
    }

    /**
     * Get safe viewport dimensions (accounts for mobile toolbars)
     */
    function getViewportDimensions() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            availableHeight: window.innerHeight,
            availableWidth: window.innerWidth
        };
    }

    /**
     * Set CSS custom properties for viewport dimensions
     * Useful for handling mobile browser chrome
     */
    function setViewportCSSVariables() {
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    }

    /**
     * Debounce function for resize handlers
     */
    function debounce(func, wait = 150) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll/touch handlers
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Handle resize with debouncing
     */
    function onResize(callback, wait = 150) {
        const debouncedCallback = debounce(() => {
            setViewportCSSVariables();
            callback({
                breakpoint: getCurrentBreakpoint(),
                viewport: getViewportDimensions(),
                device
            });
        }, wait);

        window.addEventListener('resize', debouncedCallback);
        window.addEventListener('orientationchange', debouncedCallback);
        
        // Initial call
        setViewportCSSVariables();
        callback({
            breakpoint: getCurrentBreakpoint(),
            viewport: getViewportDimensions(),
            device
        });

        return function cleanup() {
            window.removeEventListener('resize', debouncedCallback);
            window.removeEventListener('orientationchange', debouncedCallback);
        };
    }

    /**
     * Scale element to fit viewport while maintaining aspect ratio
     */
    function scaleToFit(element, options = {}) {
        const opts = {
            maxScale: 1,
            minScale: 0.1,
            padding: 20,
            maintainAspectRatio: true,
            ...options
        };

        const viewport = getViewportDimensions();
        const rect = element.getBoundingClientRect();
        
        const availableWidth = viewport.width - (opts.padding * 2);
        const availableHeight = viewport.height - (opts.padding * 2);
        
        let scaleX = availableWidth / rect.width;
        let scaleY = availableHeight / rect.height;
        
        let scale = opts.maintainAspectRatio ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
        scale = Math.min(opts.maxScale, Math.max(opts.minScale, scale));
        
        return scale;
    }

    /**
     * Center element in viewport
     */
    function centerInViewport(element) {
        const viewport = getViewportDimensions();
        const rect = element.getBoundingClientRect();
        
        const left = (viewport.width - rect.width) / 2;
        const top = (viewport.height - rect.height) / 2;
        
        return { left, top };
    }

    /**
     * Prevent scroll on mobile (useful during games)
     */
    function preventScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Prevent bounce effect on iOS
        document.addEventListener('touchmove', preventTouchMove, { passive: false });
    }

    function allowScroll() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        document.removeEventListener('touchmove', preventTouchMove);
    }

    function preventTouchMove(e) {
        e.preventDefault();
    }

    /**
     * Canvas responsive helper
     */
    function makeCanvasResponsive(canvas, options = {}) {
        const opts = {
            aspectRatio: 16/9,
            maxWidth: null,
            maxHeight: null,
            scale: window.devicePixelRatio || 1,
            ...options
        };

        function resize() {
            const viewport = getViewportDimensions();
            const container = canvas.parentElement;
            
            let width = container.clientWidth;
            let height = width / opts.aspectRatio;
            
            if (opts.maxWidth && width > opts.maxWidth) {
                width = opts.maxWidth;
                height = width / opts.aspectRatio;
            }
            
            if (opts.maxHeight && height > opts.maxHeight) {
                height = opts.maxHeight;
                width = height * opts.aspectRatio;
            }
            
            // Set display size
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            // Set actual size for retina displays
            canvas.width = width * opts.scale;
            canvas.height = height * opts.scale;
            
            // Scale context for retina
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(opts.scale, opts.scale);
            }
            
            return { width, height, scale: opts.scale };
        }

        const cleanup = onResize(resize);
        
        return {
            resize,
            cleanup
        };
    }

    /**
     * Add responsive classes to body
     */
    function updateBodyClasses() {
        const bp = getCurrentBreakpoint();
        const body = document.body;
        
        body.classList.remove('breakpoint-xs', 'breakpoint-sm', 'breakpoint-md', 'breakpoint-lg');
        body.classList.add(`breakpoint-${bp}`);
        
        body.classList.toggle('is-mobile', device.isMobile);
        body.classList.toggle('is-tablet', device.isTablet);
        body.classList.toggle('is-desktop', device.isDesktop);
        body.classList.toggle('is-touch', device.isTouch);
    }

    /**
     * Initialize responsive utilities
     */
    function init() {
        setViewportCSSVariables();
        updateBodyClasses();
        
        onResize(() => {
            updateBodyClasses();
        });
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        device,
        breakpoints,
        getCurrentBreakpoint,
        matchesBreakpoint,
        getViewportDimensions,
        setViewportCSSVariables,
        debounce,
        throttle,
        onResize,
        scaleToFit,
        centerInViewport,
        preventScroll,
        allowScroll,
        makeCanvasResponsive,
        updateBodyClasses,
        init
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.ResponsiveUtils = ResponsiveUtils;
}
