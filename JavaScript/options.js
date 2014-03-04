define(['vendor/jquery.magnific-popup'], function() {

    /**
     * Constructor of Options paper and envelope module
     * @param {object} settings
     * @returns {boolean}
     */
    function Options(settings) {
        if (typeof settings !== 'object' || settings === undefined) {
            throw new Error("settings: settings was not set");
        }

        this.setToolTip(settings.tooltip);
        this.setLightBox(settings.lightbox);
        this.setSelectedOptions(settings.selectedItem);

    }

    /**
     * Activate selected options for paper and envelope
     * @param {object} selectSettings
     * @returns {boolean}
     */
    Options.prototype.setSelectedOptions = function(selectSettings) {
        if (typeof selectSettings !== 'object' || selectSettings === undefined) {
            return false;
        }
        var selectedClass = 'selected';

        selectSettings.element.on("click", function(event) {
            event.preventDefault();

            var el = $(this);

            //check if the item clicked has already been selected
            if (el.parent().hasClass(selectedClass)) { return false; }

            //remove currently selected item
            el.parents().find('.' + selectedClass).removeClass(selectedClass);

            //set the class to show this has been selected
            el.parent().addClass(selectedClass);

            //pass this in the callback
            var ulOption = el.parents('ul.options');

            selectSettings.callback({
                url: {
                  designId : ulOption.attr('data-user-design-id'),
                  type     : ulOption.attr('data-type'),
                  optionId : el.parent().attr('data-product-id')
                },
                elements : {
                  main : ulOption,
                  selected: el.parent()
                }
            });

        });

    };

    /**
     * Activate light for options paper and envelope
     * Using third party library magnific pop up
     * @param {object} lightboxSettings
     * @returns {boolean}
     */
    Options.prototype.setLightBox = function(lightboxSettings) {
        if (typeof lightboxSettings !== 'object') {
            return false;
        }

        lightboxSettings.element.magnificPopup({
            type: 'image',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            closeMarkup: '<button class="mfp-close"><i class="mfp-close-icn"></i></button>'
        });

    };

    /**
     * Activate custom tooltip for options paper and envelope
     * @param {Object} toolTipSettings
     * @returns {boolean}
     */
    Options.prototype.setToolTip = function (toolTipSettings) {
        if (typeof toolTipSettings !== 'object') {
            return false;
        }

        var showClass = 'show';
        var toolTipClass = '.options-tool-tip';

        //click tool tip event
        toolTipSettings.clickEvent.on("click", function(e) {
            e.preventDefault();
            var el = $(this);

            //remove all tool tip classes
            el.parents('ul').find(toolTipClass).removeClass(showClass);

            //display the tool tip for the item selected
            el.parent().find(toolTipClass).addClass(showClass);

        });

        //close tooltip button
        toolTipSettings.closeEvent.on("click", function(e) {
            e.preventDefault();
            var el = $(this);
            var parentEl = el.parents('ul');

            //remove all tool tip classes
            parentEl.find(toolTipClass).removeClass(showClass);

        });

    };

    /**
     * MODEL - update options for paper and envelope
     * @param {object} settings
     * @returns {boolean}
     */
    function updateOptions(settings) {

        if (typeof settings !== 'object' || settings === undefined) {
            return false;
        }

        var selectedEl = settings.elements.selected;

        $.ajax({
            url: '/options/add/design/' + settings.url.designId + '/' + settings.url.type + '/' + settings.url.optionId,
            beforeSend: function() {
                selectedEl.find('.selected-icon').hide();
                selectedEl.append('<div class="loading"><span class="spinner"></span></div>');
            }
        }).done(function(data) {
            selectedEl.find('.selected-icon').show();
            selectedEl.find('.loading').remove();
        });

    }

    return {
        init: function() {
            /**
             * if tooltip, lightbox needs to be reused somewhere create new module
             */
            $(function() {

                new Options({
                    lightbox : {
                        element       : $('.magnific-sin-img')
                    },
                    tooltip : {
                        clickEvent    : $('.more-info'),
                        closeEvent    : $('.options-close'),
                        element       : $('.options-tool-tip')
                    },
                    selectedItem: {
                        element       : $('ul.options li a.icon'),
                        callback      : function(settings) {

                            settings.elements.main.find('.options-tool-tip').removeClass('show');
                            updateOptions(settings);

                        }
                    }
                });

            });

        }
    };

});