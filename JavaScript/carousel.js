define(["vendor/jquery.flexslider", "vendor/modernizr.custom"], function(flexSlider, modernizr) {

    /**
     * Constructor
     * @param userSettings
     */
    function Carousel(userSettings) {
        if (typeof userSettings !== 'object' ||userSettings === undefined) {
            throw new Error("settings: settings was not set");
        }

        var totalSlides = (userSettings.el.find('li').length > 1) ? true : false;

        this.userSettings = userSettings;
        this.defaultSettings = {
            animation: "slide",
            useCSS: true,
            animationLoop: totalSlides,
            touch: totalSlides,
            slideshowSpeed: 5000
        };

        this.mergeSettings();
        this.start();
    }

    /**
     * merge user and default settings together
     */
    Carousel.prototype.mergeSettings = function () {
        $.extend(true, this.defaultSettings, this.userSettings);
    };

    /**
     * start flex slider
     */
    Carousel.prototype.start = function () {
        var self = this;
        $(self.defaultSettings.el).flexslider(self.defaultSettings);
    };

    /**
     * home page Carousel
     */
    return {
        init: function (element) {
            if (typeof element !== 'object') { return false; }

            new Carousel({
                el: element,
                start: function () {
                    if (element.find('.slides li').length <= 1) {
                        $('.flex-direction-nav', element).hide();
                    }
                    $('.slides', element).removeClass('hide');
                    $('.slides-before-load', element).hide();
                    $('.flex-control-nav', element);
                    $('.flex-control-paging').wrap('<div class="paging-container"></div>');
                    element.find('.flex-active-slide p').addClass('active');
                },
                after: function () {
                    $('p', element).removeClass('active');
                    element.find('.flex-active-slide p').addClass('active');
                }
            });
        }
    }

});