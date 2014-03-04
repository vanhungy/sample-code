/*

    Parallaxative
    --------------------------------------

    Summary:
        Animates DOM elements in tandem with scrollTop

    Requirements:
        Elements to animate must carry the class 'parallax-card'
        
        Each parallax-card must have data-start-position with a starting percentage
        that is a percentage of its container div in fully-opened state
        This is used to generate a start and end position to animate the elements between
        
    TODO:
        Make target height and parallax range configurable

*/
define([],
    function () {
            
        /*
            @param1 [jQuery object]: Parallax container object
        */
        var Parallax = function ($container) {
                var self = this;
                
                self.cacheElements($container);
                self.setGlobals();
                self.initParallax();
                self.bindEvents();
            };
        
        Parallax.prototype = {
            
            /*
                @param1 [jQuery object]: Parallax container object
            */
            cacheElements: function ($container) {
                var self = this;
                    
                self.$parallax = $container;
                self.$cards = $container.find('.parallax-card');
                self.$window = $(window);
            },
            
            setGlobals: function () {
                var self = this,
                    documentHeight = $(document).height(),
                    windowHeight = $(window).height(),
                    parallaxBugger = 100, // I originally misspelled parallaxBuffer and liked it
                    parallaxRange = windowHeight * 0.9, // 90% of window 
                    parallaxOffset = self.$parallax.offset().top,
                    documentFloor = documentHeight - windowHeight;
                
                self.size = {
                    window: windowHeight,
                    targetHeight: 500
                };
                self.size.parallaxStart = parallaxOffset - self.size.window - parallaxBugger;
                self.size.parallaxEnd = self.size.parallaxStart + parallaxRange;
                
                // Check if start and end are within page range to make sure they can start/finish
                self.size.parallaxStart = (self.size.parallaxStart < 0) ? 0 : self.size.parallaxStart;
                self.size.parallaxEnd = (self.size.parallaxEnd > documentFloor) ? documentFloor : self.size.parallaxEnd;
            },
            
            bindEvents: function () {
                var self = this;
                
                self.$window.on('scroll', function () {
                    self.checkParallax();
                });
                
                self.$window.resize(function () {
                    self.resetParallax();
                });
            },
            
            initParallax: function () {
                var self = this;
                
                self.size.lowerLimit = self.$parallax.height();
                self.openParallax();
                self.size.upperLimit = self.$parallax.height();
                self.checkParallax();
            },
            
            resetParallax: function () {
                var self = this;
                
                self.setGlobals();
                self.closeParallax();
                self.initParallax();
            },
            
            openParallax: function () {
                var self = this;
                
                self.$parallax.css({
                    height: self.size.targetHeight
                });
                
                self.$cards.each(function () {
                    var $card = $(this),
                        relativeOffsetPercentage = $card.data('start-percentage'),
                        upperLimit = self.calcValueFromPercentage(0, self.size.targetHeight, relativeOffsetPercentage);

                    $card
                        .css({ top: upperLimit })
                        .data({ 'upper-limit': upperLimit });
                });
            },
            
            closeParallax: function () {
                var self = this;
                
                self.$parallax.css({
                    height: ''
                });
                
                self.$cards.css({
                    top: ''
                });
            },
            
            checkParallax: function () {
                var self = this,
                    scrollTop = self.$window.scrollTop(),
                    progress = 0;
                
                if (scrollTop >= self.size.parallaxStart) {
                    progress = self.calcPercentageInRange(self.size.parallaxStart, self.size.parallaxEnd, scrollTop);
                    
                    self.changeParallax(progress);
                }
            },
            
            /*
                @param1 [number]: Percentage of animation position
            */
            changeParallax: function (progress) {
                var self = this,
                    newContainerHeight = self.calcInverseValueFromPercentage(self.size.lowerLimit, self.size.upperLimit, progress);
                
                self.$parallax.css({
                    height: newContainerHeight
                });
                
                self.$cards.each(function () {
                    self.changeTop($(this), progress);
                });
            },
            
            /*
                @param1 [jQuery object]: Card to be animated
                @param2 [number]: Percentage of animation position
            */
            changeTop: function ($card, percentage) {
                var self = this,
                    newTop = self.calcInverseValueFromPercentage(0, $card.data('upper-limit'), percentage);
                    
                $card.css({
                    top: newTop
                });
            },
            
            /*
                @param1 [number]: Start of range to find value in
                @param2 [number]: End of range
                @param3 [number]: Percentage of animation position
            */
            calcValueFromPercentage: function (rangeStart, rangeEnd, percentage) {
                var rangeEndFloor = rangeEnd - rangeStart,
                    flooredVal = percentage / 100 * rangeEndFloor,
                    newVal = flooredVal + rangeStart;
                    
                return newVal;
            },
            
            /*
                @param1 [number]: Start of range to find value in
                @param2 [number]: End of range
                @param3 [number]: Percentage of animation position
            */
            calcInverseValueFromPercentage: function (rangeStart, rangeEnd, percentage) {
                var rangeEndFloor = rangeEnd - rangeStart,
                    flooredVal = percentage / 100 * rangeEndFloor,
                    newVal = rangeEnd - flooredVal;
                    
                return newVal;
            },
            
            /*
                @param1 [number]: Start of range to find value in
                @param2 [number]: End of range
                @param3 [number]: Percentage of animation position
            */
            calcPercentageInRange: function (rangeStart, rangeEnd, current) {
                var rangeEndFloor = rangeEnd - rangeStart,
                    currentFloor = current - rangeStart,
                    percentage = currentFloor / rangeEndFloor * 100;
                    
                percentage = (percentage < 100) ? percentage : 100;
                
                return percentage;
            }
        };

        return {
            /*
                @param1 [jQuery object]: Parallax containers
            */
            init: function ($parallax) {
            
                // Before initialising check if the device is a standard browser or check for
                // large screen size in case of laptops with touch screens
                
                if ($('html').hasClass('no-touch') || screen.width > 1024) {
                    $parallax.each(function () {
                        var newParallax = new Parallax($(this));
                    });
                }
                
            }
        };
        
    }
);