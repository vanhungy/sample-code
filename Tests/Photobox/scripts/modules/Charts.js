/**
 * Module allows you create a new form
 * I have left the dom builder functions at the bottom but ideally would be extracted to another module
 *
 */
//TODO: could be better by creating how many series you want to create etc.
if (PhotoBox === undefined){ var PhotoBox = {}; }

    // Private functions only useful for this module
    PhotoBox.Charts = (function() {
        "use strict";

        // Public functions
        // Automatically called as this is within a self executing function
        function init(chartForm) {
            if (chartForm === undefined){return;}
            this.chartForm = chartForm;

            this.createForm(2);
            this.setEventListeners();
        }

        /**
         * Create a new row in the table
         */
        init.prototype.createRow = function () {

            var elmInput = $('input');
            var row = $('<tr></tr>');
            var categoryCell = $('<td></td>').append(
                this.domInput({id:'category-'+(elmInput + 1), dataAttr:(elmInput.length + 1),type: 'text', placeholder: 'Type new category..'})
            );

            row.append(categoryCell);

            // Create two series input values
            for(var r = 1, b = 0; b < 2; b++) {
                var seriesCell = $('<td></td>').append(
                    this.domInput({id:'value-'+(elmInput.length + 1),type:'number',dataAttr:'series-'+r, placeholder:'Type value..'})
                );
                if (r === 1){ r = 2;}
                row.append(seriesCell);
            }

            this.chartForm.append(row);
        };

        /**
         * facade that creates the interface
         * @param (int) rows
         */
        init.prototype.createForm = function (rows) {
            var inputs = $('input');
            var row, categoryCell, seriesCell;

            // Create series input names
            row = $('<tr></tr>');
            for(var n = 0; n < 3; n++) {

              if (n === 0) {
                  seriesCell = $('<td></td>');
              }
              else {
                  seriesCell = $('<td></td>').append(
                      this.domInput({id:'series-'+(n), cls:'series_name',dataAttr:(n),type: 'text', placeholder: 'Type series name ..'})
                  );
              }
              row.append(seriesCell);
            }
            this.chartForm.append(row);


            for(var i= 0; i < rows; i++) {

                row = $('<tr></tr>');
                categoryCell = $('<td></td>').append(
                    this.domInput({id:'category-'+(inputs.length + 1), cls: 'category', dataAttr:(inputs.length + 1),type: 'text', placeholder: 'Type new category..'})
                );

                row.append(categoryCell);

                // Create two series input values
                for(var r = 1, b = 0; b < 2; b++) {

                    seriesCell = $('<td></td>').append(
                        this.domInput({id:'value-'+(inputs.length + 1),type:'number',dataAttr:'series-'+r, placeholder:'Type value..'})
                    );
                    if (r === 1){ r = 2;}

                    row.append(seriesCell);
                }

                this.chartForm.append(row);
            }

        };

        /**
         * Set event listeners on the element
         * TODO: could be improved by passing the elements you want to bind
         */
        init.prototype.setEventListeners = function() {
             var obj = this;

            $('#create_category').bind('click',function(e) {
                e.preventDefault();
                var cfm = confirm("Would you like to insert a new row?");
                if (cfm) { obj.createRow(); }
            });

            $('#generate_chart').bind('click',function(e) {
                e.preventDefault();
                var cfm = confirm("Are you sure you want to generate Simple Bar Chart?");
                if (cfm) { obj.generateChart(); }
            });

        };

        /**
         * Returning a new instance of highcharts
         * @return {object} - Highcharts.Chart
         */
        init.prototype.generateChart = function () {
            var chart = new Highcharts.Chart(this.getChartSettings());
            return chart;
        };

        /**
         * Set the chart settings, extends the default api settings with any new content
         * inserts user input form
         * @param {object} - settings
         * @return {Object} - api settings for highchart js
         */
        init.prototype.setChartSettings = function(settings) {
            settings = settings || {};

            var defaultChartApi = {
                chart: {
                    renderTo: 'chart',
                    type: 'column'
                },
                title: {
                    text: 'Photobox Chart'
                },
                legend: {
                    layout: 'vertical',
                    backgroundColor: '#FFFFFF',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    y: 70,
                    floating: true,
                    shadow: true
                },
                tooltip: {
                    formatter: function() {
                        return ''+
                            this.x +': '+ this.y;
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        allowPointSelect: true,
                        events: {
                            //no ontouchmove event on library
                            /*3. Once the bar chart has been displayed, it should be possible to resize any of the bars
                            using the mouse. In other words, if the user hovers over the top of the bar, they should be able to
                            click and hold the mouse button to drag the bar to a different size. This should automatically
                            adjust the numerical data entered to the corresponding new value.*/
                        }
                    }
                },
                yAxis: {
                    min: 0
                },
                xAxis: {}
            };

            $.extend(defaultChartApi, settings);

            var userInput = this.getInputChartForm();

            defaultChartApi.xAxis.categories = userInput[0];
            defaultChartApi.series = userInput[1];

            return defaultChartApi;
        };

        /**
         * return the api settings for charts
         * @return {*}
         */
        init.prototype.getChartSettings = function() {
            return this.setChartSettings();
        };

        /**
         * Get the information from the user charts
         * @return {Array} - series and categories info
         */
        init.prototype.getInputChartForm = function() {
            var categories =  [];
            var series =      [];
            var dataSeries1 = [];
            var dataSeries2 = [];

            this.chartForm.find('tr').find('input').each(function(i,v) {

                var cellInput = $(this);

                // get the category values
                if (cellInput.hasClass('category')) {
                    categories.push(cellInput.val());
                }
                // get and series values - could improve
                else if (cellInput.attr('data-content') === 'series-1') {
                    dataSeries1.push(parseInt($(this).val()));
                }
                else if (cellInput.attr('data-content') === 'series-2') {
                    dataSeries2.push(parseInt($(this).val()));
                }

            });

            //iterate over the series and assign the correct data series
            this.chartForm.find('.series_name').each(function(i) {
                series.push({
                    name: $(this).val(),
                    data: ($(this).attr('id').match('1')) ? dataSeries1 : dataSeries2
                });

            });

            return [categories, series];

        };

        /*************** dom builder factory to create elements **************/
        /** can be extended and provide api for this **/

        /**
         * Create select element
         * TODO: could be improved by allowing the api to be extended
         * @param attr
         * @return {*}
         */
        init.prototype.domSelect = function(attr) {
            attr = attr || {};
            return $('<select id="'+ (attr.id || '')+ '"></select>');
        };

        /**
         * Create input element
         * TODO: could be improved by allowing the api to be extended
         * @param {object} - element attributes
         * @return {object} input element
         */
        init.prototype.domInput = function(attr) {
            attr = attr || {};
            return $('<input type="'+(attr.type || '')+ '" value="" class="'+ ( attr.cls || '') +'"data-content="'+ (attr.dataAttr || '') +'" id="'+ (attr.id || '') +'" placeholder="'+ (attr.placeholder || '') +'"></input>');
        };
        /*************** end dom builder factory to create elements **************/

        return init;

    })();
