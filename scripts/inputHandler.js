/**
 * Unified Input Handler for Cross-Device Compatibility
 * Handles touch, mouse, and keyboard inputs consistently across all games
 * Prevents ghost clicks, handles swipe gestures, and normalizes events
 */

const InputHandler = (function() {
    'use strict';

    // Configuration
    const config = {
        tapThreshold: 10, // Max movement in pixels to consider it a tap
        swipeThreshold: 50, // Min distance in pixels to register as swipe
        swipeTimeout: 300, // Max time in ms for swipe gesture
        doubleTapDelay: 300, // Max time between taps for double-tap
        longPressDelay: 500, // Time to trigger long press
        preventGhostClicks: true
    };

    // Touch state tracking
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTapTime = 0;
    let longPressTimer = null;
    let isTouch = false;
    let ghostClickPrevention = new Set();

    /**
     * Normalize event to get consistent coordinates
     */
    function getEventCoords(event) {
        if (event.touches && event.touches.length > 0) {
            return {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
                pageX: event.touches[0].pageX,
                pageY: event.touches[0].pageY
            };
        } else if (event.changedTouches && event.changedTouches.length > 0) {
            return {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
                pageX: event.changedTouches[0].pageX,
                pageY: event.changedTouches[0].pageY
            };
        } else {
            return {
                x: event.clientX,
                y: event.clientY,
                pageX: event.pageX,
                pageY: event.pageY
            };
        }
    }

    /**
     * Prevent ghost clicks after touch events
     */
    function preventGhostClick(x, y) {
        if (!config.preventGhostClicks) return;
        
        const key = `${Math.round(x)},${Math.round(y)}`;
        ghostClickPrevention.add(key);
        
        setTimeout(() => {
            ghostClickPrevention.delete(key);
        }, 2500);
    }

    /**
     * Check if this click should be prevented
     */
    function isGhostClick(x, y) {
        if (!config.preventGhostClicks) return false;
        
        const key = `${Math.round(x)},${Math.round(y)}`;
        return ghostClickPrevention.has(key);
    }

    /**
     * Unified click/tap handler
     * Works with both mouse and touch events
     */
    function onClick(element, callback, options = {}) {
        const opts = {
            preventDefault: true,
            stopPropagation: false,
            ...options
        };

        function handleTouchStart(e) {
            isTouch = true;
            const coords = getEventCoords(e);
            touchStartX = coords.x;
            touchStartY = coords.y;
            touchStartTime = Date.now();

            // Long press detection
            if (opts.onLongPress) {
                longPressTimer = setTimeout(() => {
                    opts.onLongPress(e, element);
                }, config.longPressDelay);
            }
        }

        function handleTouchEnd(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            const coords = getEventCoords(e);
            const deltaX = Math.abs(coords.x - touchStartX);
            const deltaY = Math.abs(coords.y - touchStartY);
            const deltaTime = Date.now() - touchStartTime;

            // Check if it's a tap (not a swipe or drag)
            if (deltaX < config.tapThreshold && deltaY < config.tapThreshold) {
                if (opts.preventDefault) e.preventDefault();
                if (opts.stopPropagation) e.stopPropagation();
                
                preventGhostClick(coords.x, coords.y);
                
                // Double tap detection
                const now = Date.now();
                if (opts.onDoubleTap && (now - lastTapTime) < config.doubleTapDelay) {
                    opts.onDoubleTap(e, element);
                } else {
                    callback(e, element);
                }
                lastTapTime = now;
            }
        }

        function handleClick(e) {
            const coords = getEventCoords(e);
            
            // Prevent ghost clicks
            if (isTouch && isGhostClick(coords.x, coords.y)) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (!isTouch) {
                if (opts.preventDefault) e.preventDefault();
                if (opts.stopPropagation) e.stopPropagation();
                callback(e, element);
            }
        }

        // Attach both touch and mouse events
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });
        element.addEventListener('click', handleClick, { passive: false });

        // Return cleanup function
        return function cleanup() {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('click', handleClick);
        };
    }

    /**
     * Unified swipe handler
     */
    function onSwipe(element, callbacks) {
        let startX, startY, startTime;

        function handleStart(e) {
            const coords = getEventCoords(e);
            startX = coords.x;
            startY = coords.y;
            startTime = Date.now();
        }

        function handleEnd(e) {
            const coords = getEventCoords(e);
            const deltaX = coords.x - startX;
            const deltaY = coords.y - startY;
            const deltaTime = Date.now() - startTime;

            if (deltaTime > config.swipeTimeout) return;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            // Determine swipe direction
            if (absX > config.swipeThreshold || absY > config.swipeThreshold) {
                e.preventDefault();
                
                if (absX > absY) {
                    // Horizontal swipe
                    if (deltaX > 0 && callbacks.onSwipeRight) {
                        callbacks.onSwipeRight(e, deltaX);
                    } else if (deltaX < 0 && callbacks.onSwipeLeft) {
                        callbacks.onSwipeLeft(e, Math.abs(deltaX));
                    }
                } else {
                    // Vertical swipe
                    if (deltaY > 0 && callbacks.onSwipeDown) {
                        callbacks.onSwipeDown(e, deltaY);
                    } else if (deltaY < 0 && callbacks.onSwipeUp) {
                        callbacks.onSwipeUp(e, Math.abs(deltaY));
                    }
                }
            }
        }

        element.addEventListener('touchstart', handleStart, { passive: true });
        element.addEventListener('touchend', handleEnd, { passive: false });
        element.addEventListener('mousedown', handleStart);
        element.addEventListener('mouseup', handleEnd);

        return function cleanup() {
            element.removeEventListener('touchstart', handleStart);
            element.removeEventListener('touchend', handleEnd);
            element.removeEventListener('mousedown', handleStart);
            element.removeEventListener('mouseup', handleEnd);
        };
    }

    /**
     * Unified drag handler
     */
    function onDrag(element, callbacks) {
        let isDragging = false;
        let startX, startY, currentX, currentY;

        function handleStart(e) {
            isDragging = true;
            const coords = getEventCoords(e);
            startX = coords.pageX;
            startY = coords.pageY;
            currentX = startX;
            currentY = startY;

            if (callbacks.onDragStart) {
                callbacks.onDragStart(e, { x: startX, y: startY });
            }
        }

        function handleMove(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            const coords = getEventCoords(e);
            currentX = coords.pageX;
            currentY = coords.pageY;

            if (callbacks.onDragMove) {
                callbacks.onDragMove(e, {
                    x: currentX,
                    y: currentY,
                    deltaX: currentX - startX,
                    deltaY: currentY - startY
                });
            }
        }

        function handleEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            const coords = getEventCoords(e);

            if (callbacks.onDragEnd) {
                callbacks.onDragEnd(e, {
                    x: coords.pageX,
                    y: coords.pageY,
                    deltaX: coords.pageX - startX,
                    deltaY: coords.pageY - startY
                });
            }
        }

        element.addEventListener('touchstart', handleStart, { passive: false });
        element.addEventListener('touchmove', handleMove, { passive: false });
        element.addEventListener('touchend', handleEnd, { passive: false });
        element.addEventListener('mousedown', handleStart);
        element.addEventListener('mousemove', handleMove);
        element.addEventListener('mouseup', handleEnd);

        return function cleanup() {
            element.removeEventListener('touchstart', handleStart);
            element.removeEventListener('touchmove', handleMove);
            element.removeEventListener('touchend', handleEnd);
            element.removeEventListener('mousedown', handleStart);
            element.removeEventListener('mousemove', handleMove);
            element.removeEventListener('mouseup', handleEnd);
        };
    }

    /**
     * jQuery plugin integration
     */
    if (typeof jQuery !== 'undefined') {
        jQuery.fn.onUnifiedClick = function(callback, options) {
            return this.each(function() {
                onClick(this, callback, options);
            });
        };

        jQuery.fn.onUnifiedSwipe = function(callbacks) {
            return this.each(function() {
                onSwipe(this, callbacks);
            });
        };

        jQuery.fn.onUnifiedDrag = function(callbacks) {
            return this.each(function() {
                onDrag(this, callbacks);
            });
        };
    }

    // Public API
    return {
        onClick,
        onSwipe,
        onDrag,
        getEventCoords,
        config
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.InputHandler = InputHandler;
}
