Object.extend = function(c, b) {
    for (var a in b) {
        c[a] = b[a]
    }
    return c
};

Function.prototype.bind = function(b) {
    var a = this;
    return function() {
        return a.apply(b, arguments)
    }
};

function updateCalendar(startCal, endCal, activeCal) {
    var nonactiveCal = (startCal == activeCal) ? endCal : startCal;
    if (endCal.getDate().format("YYYYmm") < startCal.getDate().format("YYYYmm")) {
        var tmpDate = activeCal.getDate();
        tmpDate.setMonth(activeCal.getDate().getMonth());
        tmpDate.setFullYear(activeCal.getDate().getFullYear());
        nonactiveCal.update(tmpDate);
    } else if ((endCal.getDate().format("DD") < startCal.getDate().format("DD")) && (endCal.getDate().format("YYYYmm") == startCal.getDate().format("YYYYmm"))) {
        var tmpDate = activeCal.getDate();
        tmpDate.setDate(activeCal.getDate().getDate());
        nonactiveCal.update(tmpDate);
    }
    console.log('Update calendar');
    activeCal.markRanges(startCal, endCal);
    nonactiveCal.markRanges(startCal, endCal);
}

/****** Library Functions ****/


(function($) {

    var flightSearch = function() {
        var $this = this;
        // Define common Variables
        this.currentDate = new Date();
        this.utcDate = null;
        this.startDate = null;
        this.endDate = null;
        this.departCalendar = null;
        this.returnCalendar = null;
        this.utcDate = new Date(utcDate);


        var utc_Date = new Date();
        var start_Date = new Date(new Date().getTime());
        var end_Date = new Date(new Date().getTime() + (100000000000000));
        end_Date.setHours(23, 59);
        var date_Range = [new DateRange(start_Date, end_Date)];
        flightsDepartCalendar = new Calendar("flightsDepartCalendar", "flightsDepart", "flightsDepart", date_Range, "flightsDepart", false, true, true, "Select a departure date", true);
        flightsReturnCalendar = new Calendar("flightsReturnCalendar", "flightsReturn", "flightsReturn", date_Range, "flightsReturn", false, true, true, "Select a return date", true, flightsDepartCalendar);
        flightsDepartCalendar.createCalendar();
        flightsReturnCalendar.createCalendar();
        flightsDepartCalendar.setOnChangeCallback(new Function('updateCalendar(flightsDepartCalendar,flightsReturnCalendar,flightsDepartCalendar);'));
        flightsDepartCalendar.setOnChangeCallback(new Function('triggerAutoFocus(flightsDepartCalendar,flightsReturnCalendar,flightsDepartCalendar);'));
        flightsReturnCalendar.setOnChangeCallback(new Function('updateCalendar(flightsDepartCalendar,flightsReturnCalendar,flightsReturnCalendar);'));
    }

    $(document).ready(function() {
        flightSearch();
    });

})(jQuery);

function triggerAutoFocus(departCalendar, returnCalendar, activeCalendar) {
  if (departCalendar == activeCalendar) {
    //console.log('Trigger auto focus');
    updateCalendar(flightsDepartCalendar, flightsReturnCalendar, flightsDepartCalendar);
    document.getElementById('flightsReturnTextField').focus();
  } else {
    updateCalendar(flightsDepartCalendar, flightsReturnCalendar, flightsDepartCalendar);
  }
}

jQuery(document).mousedown(function(e) {
    currElem = e.target;
    if (!(jQuery('.calendarPage').has(e.target).length > 0)) {
        jQuery('.calendarPage').removeClass('showcal');
    }
    if (!(jQuery('.ui-autocomplete').has(e.target).length > 0)) {
        jQuery('.ui-autocomplete').hide();
    }
});
