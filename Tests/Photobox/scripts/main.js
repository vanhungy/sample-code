/**
 * Things could improve
 * 1. Create API to the charts module
 * 2. Could not to feature 3 on test as i was suggested to use a third party library to generate the charts,
 * however looking at the api, this didnt have much on settings events
 * 3. Adding client side javascript to validate the items entered
 * 4. Improve test coverage on the module - making sure developers are confident on release (of course this comes at a price of time).
 * 5. pass the buttons element related to chart table so can be fully extended
 * note: i have commented most of the things i would improve on. I would not put all commnents like this in real development
 */

if (PhotoBox === undefined){ var PhotoBox = {}; }

/* Basic use of using requires js to load dependencies */
require(["jquery", "lib/highchart/highcharts", "lib/highchart/exporting", "modules/Charts"], function($) {

    //document is ready
    $(function() {

        var charts = new PhotoBox.Charts($('#chart_form_container table'));
        //You can now extend this and extending this module if required
        //e.g charts.prototype.newfunction = function create chart(){};
        //5. It should be assumed that the code will be maintained and possibly extended by another developer in the team

    });

});
