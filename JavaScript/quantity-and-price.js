define(['storage'],
    function (storage) {

        /**
         * Module quantity and price
         * @param {object} options - pass the required items
         * @constructor
         */
        function QuantityPriceSelector(options) {

            if (options === null || typeof options !== 'object') {
                throw new Error("no options passed through");
            }

            this.setElements(options.elements);
            this.setStorage(options.storage);
            this.loadCardQuantity();
            this.setEventHandlers();
            this.updateOptions();

        }

        /**
         * Set elements required for quantity select selector
         * @param {object} elements
         */
        QuantityPriceSelector.prototype.setElements = function (elements) {
            if (elements === null || typeof elements !== 'object') {
                throw new Error("setElements: no storage available");
            }

            for (var element in elements) {

                if (elements[element].length) {
                    this[element] = elements[element];
                }

            }

        };


        /**
         * Sets storage for quantity
         * @param storage
         * @returns {boolean}
         */
        QuantityPriceSelector.prototype.setStorage = function (storage) {
            if (storage === null || typeof storage !== 'object') {
                return false;
            }

            this.storage = {
                at: storage.at,
                expires: storage.time
            };

        };

        /**
         * Set event handlers on elements
         */
        QuantityPriceSelector.prototype.setEventHandlers = function () {

            this.quantitySelector.on("change", $.proxy(function (select) {

                this.updateTotalPrice();
                this.updateOptions();
                this.saveCardQuantity();
                this.updatePricePerCard();

            }, this));

        };

        /**
         * Update options price when quantity is changed
         * Free options do not change for options when quantity is changed
         * @returns {boolean}
         */
        QuantityPriceSelector.prototype.updateOptions = function () {
            if (this.options === undefined) {
                return false;
            }

            var quantity = this.quantitySelector.val();

            //loop through all the options list elements available
            this.options.each(function () {

                var optionPrice = $(this).find('.price');

                //if the option is free then dont change the price for option
                if (optionPrice.attr('data-option-free') !== 'true') {

                    var currencySymbol = optionPrice.attr('data-curreny-symbol');

                    var newPrice = parseFloat(quantity * optionPrice.attr('data-option-numeric-part')).toFixed(2);

                    // position of the currency sign
                    var priceIncludeCurrency = optionPrice.attr('data-curreny-position') === 'before' ? currencySymbol + newPrice :
                        newPrice + currencySymbol;

                    optionPrice.html('+ ' + priceIncludeCurrency);

                }

            });

            return true;

        };

        /**
         * Load card quantity
         * If local storage is found then use the value of card quantity
         */
        QuantityPriceSelector.prototype.loadCardQuantity = function () {

            var cardQuantity = this.storage.at.load('cardQuantity');
            if (cardQuantity) {
                this.quantitySelector.val(cardQuantity);
            }
            this.updateTotalPrice();
            this.updatePricePerCard();

        };

        /**
         * Save card quantity in local storage
         */
        QuantityPriceSelector.prototype.saveCardQuantity = function () {
            this.storage.at.save('cardQuantity', this.quantitySelector.val(), this.storage.expires);
        };

        /**
         * Update total price on page based on quantity selected
         */
        QuantityPriceSelector.prototype.updateTotalPrice = function () {
            var price = this.quantitySelector.find(':selected').data('price');
            this.totalPrice.text(price);
        };

        /**
         * Update price per card based on quantity selected
         */
        QuantityPriceSelector.prototype.updatePricePerCard = function () {
            var price = this.quantitySelector.find(':selected').data('price-per-card');
            this.pricePerCard.text(price);
        };

        return {
            init: function () {

                var $container = $('.quantity-and-price');

                var options = {
                    elements: {
                        container: $container,
                        quantitySelector: $('select', $container),
                        totalPrice: $('h2', $container),
                        pricePerCard: $('.price-per-card .price', $container),
                        options: $('ul.options-list li')
                    },
                    storage: {
                        at: storage.localStore,
                        expires: 24 * 60 * 60
                    }
                };

                new QuantityPriceSelector(options);

            }
        };

    });
