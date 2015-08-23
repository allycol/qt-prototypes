var calendarErrMsg = "Date entered is not in the correct format. Must be dd/mm/yyyy ";
var slideSide = '';
var alreadyCreated = false;
var hasClick = false;
var isiPad = navigator.userAgent.match(/iPad/i) != null;
Calendar.prototype.updateDaySelectOptions = function() {
    var options = this.dayField.options;
    var optionsLength = 0;
    var selectedIndex = 0;
    var m = this.displayDate.getMonth();
    var d = this.displayDate.getDate();
    var temp = new Date(this.displayDate);
    for (var i = 1; i <= 31; ++i) {
        temp.setDate(i);
        if (m == temp.getMonth()) {
            if (temp.dateWithinRanges(this.dateRanges)) {
                if (i == d) {
                    selectedIndex = optionsLength;
                }
                options[optionsLength] = new Option(temp.format(daySelectFormat), i);
                ++optionsLength;
            }
        }
    }
    options.length = optionsLength;
    this.dayField.selectedIndex = selectedIndex;
}
Calendar.prototype.updateMonthYearSelectOptions = function() {
        var options = this.monthYearField.options;
        var optionsLength = 0;
        var selectedIndex = 0;
        var ddm = this.displayDate.getMonth();
        var ddy = this.displayDate.getFullYear();
        var endM = this.endDate.getMonth();
        var endY = this.endDate.getFullYear();
        var temp = new Date(this.startDate);
        temp.setDate(1);
        var m = temp.getMonth();
        var y = temp.getFullYear();
        while (y < endY || (m <= endM && y <= endY)) {
            if (temp.monthWithinRanges(this.dateRanges)) {
                if (m == ddm && y == ddy) {
                    selectedIndex = optionsLength;
                }
                var label = buildMonthYearSelectLabel(temp.getShortMonth(), y);
                var value = (m + 1) + ',' + y;
                options[optionsLength] = new Option(label, value);
                ++optionsLength;
            }
            temp.setMonth(m + 1);
            m = temp.getMonth();
            y = temp.getFullYear();
        }
        options.length = optionsLength;
        this.monthYearField.selectedIndex = selectedIndex;
    }
    /*** for adding month ****/
Date.isLeapYear = function(year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function(year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function() {
    var y = this.getFullYear();
    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0));
};

Date.prototype.getDaysInMonth = function() {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function(value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
Calendar.prototype.updateHourSelectOptions = function() {

    var options = this.hourField.options;
    var fieldVal = this.hourField.value;

    options.length = 0;
    var range = new DateRange(new Date(this.displayDate), new Date(this.displayDate));
    range.from.setHours(0, 0, 0);
    range.to.setHours(11, 59, 59);
    var selected = false;
    var selectedIndex = null;
    if (this.isAnytime) {
        if (this.isAnytimeSelected || !this.hasUserSetHour) {
            selectedIndex = options.length;
        }
        options[options.length] = new Option(Date.time[0], 'Anytime', false, false);
    }
    if (range.intersectsRanges(this.dateRanges)) {
        if (this.hourRangeSelected && range.withinRange(this.displayDate) && selectedIndex == null) {
            selectedIndex = options.length;
        }
        options[options.length] = new Option(Date.time[1], 'Morning', false, false);
    }
    range.from.setHours(12, 0, 0);
    range.to.setHours(17, 59, 59);
    if (range.intersectsRanges(this.dateRanges)) {
        if (this.hourRangeSelected && range.withinRange(this.displayDate) && selectedIndex == null) {
            selectedIndex = options.length;
        }
        options[options.length] = new Option(Date.time[2], 'Afternoon', false, false);
    }
    range.from.setHours(18, 0, 0);
    range.to.setHours(20, 59, 59);
    if (range.intersectsRanges(this.dateRanges)) {
        if (this.hourRangeSelected && range.withinRange(this.displayDate) && selectedIndex == null) {
            selectedIndex = options.length;
        }
        options[options.length] = new Option(Date.time[3], 'Evening', false, false);

    }

    var temp = new Date(this.displayDate);
    for (var i = 1; i <= 23; ++i) {
        temp.setHours(i, 0, 0);
        if (temp.withinRanges(this.dateRanges)) {
            if (selectedIndex == null && i == this.displayDate.getHours()) {
                selectedIndex = options.length;
            }
            options[options.length] = new Option((i < 10 ? ('0' + i + ':00') : (i + ':00')), i, false, false);
        }
    }
    this.hourField.selectedIndex = selectedIndex;
}
Calendar.prototype.updateFormInputs = function() {
    if (this.haveFieldsBeenInserted) {
        var strFmt = 'YYYYmmDD0000';
        if (this.startDate.format('YYYYmmDDHH00') == this.displayDate.format('YYYYmmDDHH00')) strFmt = 'YYYYmmDDHH00';
        this.dateFormatted.value = this.displayDate;
        this.formattedField.value = this.displayDate.format(strFmt);
        this.bookLeadFormattedField.value = this.startDate.format(strFmt);

        this.timeField.value = this.displayDate.getTime();
        this.yearField.value = this.displayDate.getFullYear();
        this.monthField.value = this.displayDate.getMonth() + 1;


        this.monthYearField.value = this.monthField.value + ',' + this.yearField.value;
        this.dayField.value = this.displayDate.getFullDay();
        this.hourField.value = this.displayDate.getHours();
        this.textField.value = this.displayDate.format(textDateDisplayFormat);
    }
}
Calendar.prototype.updateInputField = function(displayDate) {
    this.displayDate = new Date(displayDate.getTime()); // construct new date object as ie popup doesn't have date.js.
    if (!this.displayDate.withinRanges(this.dateRanges)) {
        this.pullWithinRange();
    }
    this.updateFormInputs();

}
Calendar.prototype.update = function(displayDate) { // This must be the only method to set 'this.displayDate'
    this.displayDate = new Date(displayDate.getTime()); // construct new date object as ie popup doesn't have date.js.
    if (!this.displayDate.withinRanges(this.dateRanges)) {
        this.pullWithinRange();
    }
    this.updateFormInputs();
    var endMon = this.endDate.getMonth();
    var endYear = this.endDate.getFullYear();
    var startMon = this.startDate.getMonth();
    var startYear = this.startDate.getFullYear();
    var actual = this.displayDate;
    this.divCalendar.innerHTML = this.createCalendarHtml(actual);
    if (window.navigator.userAgent.indexOf('MSIE 8') == -1) {
        jQuery(this.divCalendar).find('div.dupMonth').remove();
    }
    this.displayDate = new Date(displayDate.getTime());
    this.displayDate = new Date(displayDate.getTime());
    if ((startMon == actual.getMonth() && startYear == actual.getFullYear())) {
        jQuery(this.divCalendar).find('.cal_nav').addClass('disabled');
    } else if ((endMon == actual.getMonth() && endYear == actual.getFullYear())) {
        jQuery(this.divCalendar).find('.cal_nav_rght').addClass('disabled');
    } else {
        jQuery(this.divCalendar).find('.cal_nav_rght').removeClass('disabled');
        jQuery(this.divCalendar).find('.cal_nav').removeClass('disabled');
    }
    if (this.onChangeCallback != null) {
        this.onChangeCallback();
    }
    if (this.popup != null) {
        if (this.useIePopup) {
            this.popup.document.body.innerHTML = this.divCalendar.innerHTML;
        } else {
            this.popup = this.divCalendar;
        }
    }
}
Calendar.prototype.slideAnimate =
    function(noAnimate) {

        var windowWidth = $(window).width();
        var showOneMonth = windowWidth < 640;
        //console.log(showOneMonth);

        var calendarContents;

        if (slideSide == 'inc') {
            var currentMonthDiv;
            var firstMonDiv = jQuery(this.divCalendar).find('div.calendar')[0].children[0].innerHTML.split(' ')[0].toUpperCase();
            var actualMonth = new Date().getFullMonth();

            if(noAnimate) {
              if(showOneMonth) jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '-100%');
              else jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '-50%');
            } else {
              if(showOneMonth) {
                jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '0').animate({
                  left: '-100%'
                });
              } else {
                jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '0').animate({
                  left: '-50%'
                });
              }
            }

            jQuery(this.divCalendar).find('div.calendar:last').remove();

        } else if (slideSide == 'dec') {

            if(noAnimate) {
                jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '0');
            } else {
                jQuery(this.divCalendar).find('.cal_contents').stop().css('left', '-50%').animate({
                    left: '0'
                });
            }
        }
    };

Calendar.prototype.updateCell = function(displayDate,noAnimate) { // This must be the only method to set 'this.displayDate'
    this.displayDate = new Date(displayDate.getTime()); // construct new date object as ie popup doesn't have date.js.
    if (!this.displayDate.withinRanges(this.dateRanges)) {
        this.pullWithinRange();
    }
    var actual = this.displayDate;
    this.divCalendar.innerHTML = this.createCalendarHtml(actual);
    if (isiPad) {
        this.touchEvent();
    };
    this.displayDate = new Date(displayDate.getTime());
    var endMon = this.endDate.getMonth();
    var endYear = this.endDate.getFullYear();
    var startMon = this.startDate.getMonth();
    var startYear = this.startDate.getFullYear();
    if ((startMon == actual.getMonth() && startYear == actual.getFullYear())) {
        jQuery(this.divCalendar).find('.cal_nav').addClass('disabled');
    } else if ((endMon == actual.getMonth() && endYear == actual.getFullYear())) {
        jQuery(this.divCalendar).find('.cal_nav_rght').addClass('disabled');
    } else {
        jQuery(this.divCalendar).find('.cal_nav_rght').removeClass('disabled');
        jQuery(this.divCalendar).find('.cal_nav').removeClass('disabled');
    }
    if (this.popup != null) {
        if (this.useIePopup) {
            this.popup.document.body.innerHTML = this.divCalendar.innerHTML;
        } else {
            this.popup = this.divCalendar;
        }
    }
    if (window.navigator.userAgent.indexOf('MSIE 8') == -1) {
        this.slideAnimate(noAnimate);
    }


}
Calendar.prototype.pullWithinRange = function() {
    var done = false;
    var closestEarlier = null;
    var closestLater = null;
    var valueTime = this.displayDate.getTime();
    for (var i = 0; i < this.dateRanges.length; ++i) {
        var from = this.dateRanges[i].from.getTime();
        var to = this.dateRanges[i].to.getTime();
        if (to < valueTime && (closestEarlier == null || (valueTime - to) < (valueTime - closestEarlier.getTime()))) {

            closestEarlier = new Date(to);
        } else if (valueTime < from && (closestLater == null || (from - valueTime) < (closestLater.getTime() - valueTime))) {
            closestLater = new Date(from);
        }
    }
    if (closestEarlier != null && closestEarlier.getMonth() == this.displayDate.getMonth()) {

        this.displayDate = closestEarlier;
    } else if (closestLater != null && closestLater.getMonth() == this.displayDate.getMonth()) {
        this.displayDate = closestLater;
    } else {
        this.displayDate = this.dateRanges[0].from;
    }
}
Calendar.prototype.updateDayOfMonth = function(dayOfMonth, monthofyear, currentyear) {
    /*var temp = new Date(this.displayDate);
    temp.setYear(currentyear);
    temp.setMonth(monthofyear);

    temp.setDate(dayOfMonth);*/

    //QDIRECTSMI_1539
    var UTCTimestamp = Date.UTC(currentyear, monthofyear, dayOfMonth, 0, 0, 0);
    var stdDate = new Date(UTCTimestamp);
    var resetOffset = stdDate.stdTimezoneOffset();
    var temp = new Date(UTCTimestamp + (resetOffset * 60 * 1000));
    /*QDIRECTSMI_1488
    var temp=new Date(Date.UTC(currentyear,monthofyear,dayOfMonth,0,new Date().stdTimezoneOffset(),0));
       Not required anymore since date is created in UTC - JIRA 1539
    if(this.hasUserSetHour==false&&this.defaultHour!=null&&this.defaultHour>=0&&this.defaultHour<=23&& temp.dst()==false){
        temp.setHours(this.defaultHour,0,0); requirement to go back to a default hour, like morning, if available.
    }


    QDIRECTSMI_1488 */
    this.selectedCalDate = "";
    this.update(temp);
    this.adjustHourOfDay();




}

Calendar.prototype.decMonthYear = function() {
    slideSide = 'dec';
    var startM = this.startDate.getMonth();
    var startY = this.startDate.getFullYear();
    var temp = new Date(this.displayDate);
    temp.setDate(1);
    var m = temp.getMonth();
    var y = temp.getFullYear();

    if (startM != m) {
        if (m == 0) {
            m = 11;
            temp.setYear(y - 1);
        }

        temp.setMonth(m);
        if (startY < y || (startM <= m && startY <= y)) {
            if (temp.monthWithinRanges(this.dateRanges)) {
                m = temp.getMonth();
                if (m == 0) {
                    m = 11;
                    temp.setYear(y - 1);
                }
                y = temp.getFullYear();
                var monthCommaYear = (m) + ',' + y;
                this.updateMonthYear(monthCommaYear);
            }
        }
    } else if (startM == m && startY != y) {
        if (m == 0) {
            m = 11;
            temp.setYear(y - 1);
        }

        temp.setMonth(m);
        if (startY < y || (startM <= m && startY <= y)) {
            if (temp.monthWithinRanges(this.dateRanges)) {
                m = temp.getMonth();
                if (m == 0) {
                    m = 11;
                    temp.setYear(y - 1);
                }
                y = temp.getFullYear();
                var monthCommaYear = (m) + ',' + y;
                this.updateMonthYear(monthCommaYear);
            }
        }
    }
}

Calendar.prototype.incMonthYear = function() {
     slideSide = 'inc';
    var endM = this.endDate.getMonth();
    var endY = this.endDate.getFullYear();
    var temp = new Date(this.displayDate);
    temp.setDate(1);
    var m = temp.getMonth();
    var y = temp.getFullYear();
    temp.setMonth(m + 1);
    if (y < endY || (m <= endM && y <= endY)) {
        if (temp.monthWithinRanges(this.dateRanges)) {
            m = temp.getMonth();
            y = temp.getFullYear();
            var monthCommaYear = (m + 1) + ',' + y;
            this.updateMonthYear(monthCommaYear);
        }
    }
}
Calendar.prototype.updateMonthYear = function(monthCommaYear,setSlide) {
    var my = monthCommaYear.split(',');
    var m = my[0] - 1;
    var y = my[1];
    var temp = new Date(this.displayDate);
    temp.setFullYear(y);
    temp.setMonth(m);
    while (m != temp.getMonth()) {
        temp.setTime(temp.getTime() - 24 * 60 * 60 * 1000);
    }
    if (this.hasUserSetHour == false && this.defaultHour != null && this.defaultHour >= 0 && this.defaultHour <= 23) {
        temp.setHours(this.defaultHour, 0, 0); // requirement to go back to a default hour, like morning, if available.
    }

    this.updateCell(temp,false);
    //this.adjustHourOfDay();
}
Calendar.prototype.updateHourOfDay = function(hourOfDay) {
    this.hasUserSetHour = true;
    this.hourRangeSelected = isNaN(parseInt(hourOfDay));
    var hourOfDayString = hourOfDay.toString().toLowerCase();

    if ('morning' == hourOfDayString) {
        hourOfDay = (this.isAnytime == true) ? 6 : 1;
    } else if ('afternoon' == hourOfDayString) {
        hourOfDay = (this.isAnytime == true) ? 15 : 12;
    } else if ('evening' == hourOfDayString) {
        hourOfDay = (this.isAnytime == true) ? 20 : 18;
    }

    if ('anytime' == hourOfDayString) {
        this.isAnytimeSelected = true;
        hourOfDay = 12;
    } else {
        this.isAnytimeSelected = false;
    }
    var temp = new Date(this.displayDate);
    temp.setHours(hourOfDay);
    this.update(temp);
    this.adjustHourOfDay();
}
Calendar.prototype.adjustHourOfDay = function() {
    if (this.hourRangeSelected) {
        var hourOfDay = this.hourField.value;
        var hourOfDayString = hourOfDay.toString().toLowerCase();

        if ('morning' == hourOfDayString) {
            hourOfDay = (this.isAnytime == true) ? 6 : 1;
        } else if ('afternoon' == hourOfDayString) {
            hourOfDay = (this.isAnytime == true) ? 15 : 12;
        } else if ('evening' == hourOfDayString) {
            hourOfDay = (this.isAnytime == true) ? 20 : 18;
        }
        if ('anytime' == hourOfDayString) {

            this.isAnytimeSelected = true;
            hourOfDay = 12;
        } else {
            this.isAnytimeSelected = false;
        }
        if (hourOfDay != this.displayDate.getHours()) {
            var temp = new Date(this.displayDate);
            temp.setHours(hourOfDay);
            this.update(temp);
        }
    }
}


Calendar.prototype.departCalDate = function(depDate) {
    this.createCalendarHtml();
};

Calendar.prototype.createCalendarHtml = function(stDate) {
    var raw = "";
    for (var si = 0; si < 3; si++) {
        if (si > 0) {
            (this.displayDate).addMonths(1);
        }
        raw += '<div class="calendar tableCalendar"';
        if (this.showCalendarIcon) {
            raw += '';
        }
        raw += '> ';
        var temp = new Date(stDate);
        temp.setDate(1);
        var m = temp.getMonth();
        var y = temp.getFullYear();
        var dd = "";
        var dm = "";
        var dy = "";
        var ddd1 = "";
        var ddm1 = "";
        var ddy1 = "";
        var ddd1 = this.displayDate.getDate();
        var ddm1 = this.displayDate.getMonth();
        var ddy1 = this.displayDate.getFullYear();
        var depDate;
        if (this.dateFormatted.value != "") {
            depDate = new Date(this.dateFormatted.value);
        } else {
            depDate = new Date();
        }
        dd = depDate.getDate();
        dm = depDate.getMonth();
        dy = depDate.getFullYear();
        raw += '<div class="title head_title">' + this.displayDate.format(calendarDateDisplayFormat) + '</div>';
        raw += '<div class="days tableCalendar">';
        raw += '\n<div class="table_head tableTr"><div class="tableTh">' + temp.getShortDDDIndex(0).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(1).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(2).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(3).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(4).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(5).toUpperCase() + '</div><div class="tableTh">' + temp.getShortDDDIndex(6).toUpperCase() + '</div></div>';
        var temp = new Date(this.displayDate);
        temp.setDate(1);
        var startDay = temp.getDay();
        var selectedRange = this.calendarSelection[0];
        for (var i = 0; i < 6; ++i) {
            raw += '\n<div class="tableTr">';
            for (var j = 0; j < 7; ++j) {

                if ((j + 7 * i) >= startDay && temp.getMonth() == this.displayDate.getMonth()) {

                    raw += '<div class="tableTd';
                    if (this.dateRanges == null || temp.dateWithinRanges(this.dateRanges)) {

                        if ((temp.getMonth() == (selectedRange.to).getMonth() && (temp.getFullYear() == (selectedRange.to).getFullYear()) && (temp.getDate() == (selectedRange.to).getDate()) || (temp.getMonth() == (selectedRange.from).getMonth() && (temp.getFullYear() == (selectedRange.from).getFullYear()) && (temp.getDate() == (selectedRange.from).getDate())))) {
                            raw += ' active"';
                        }
                        else if (temp.dateWithinRanges(this.calendarSelection)) {
                            raw += ' selectedRange"';
                        } else {
                            raw += ' date"';
                        }
                        var tempMonth = temp.getMonth() + 1;
                        raw += ' date=' + tempMonth + '/' + temp.getDate() + '/' + temp.getFullYear();

                        raw += ' onclick="javascript:' + this.popupVarName() + '.hidePopup();' + this.popupVarName() + '.updateDayOfMonth(' + temp.getDate() + ',' + temp.getMonth() + ',' + temp.getFullYear() + ');"';

                        raw += ' onmouseover="javascript:this.className=this.className+\' hover\';';
                        if (this.otherCalendar != null)
                            raw += 'javascript:' + this.popupVarName() + '.hoverRanges(this);';
                        raw += '" onmouseout="javascript:this.className=this.className.replace(/ hover/ig,\'\');"';
                    } else {
                        raw += ' disabledCell"';
                    }
                    raw += '><span class="intdepDate">' + temp.getDate() + '</span></div>';
                    var UTCTimestamp = Date.UTC(temp.getFullYear(), temp.getMonth(), ((j + 7 * i) + 2 - startDay), 0, 0, 0);
                    var currentOffset = temp.stdTimezoneOffset();
                    var temp = new Date(UTCTimestamp + (currentOffset * 60 * 1000));
                } else {
                    raw += '<div class="emptycell tableTd">&nbsp;</div>';
                }
            }
            raw += '</div>';
        }
        raw += '</div></div>';
    }
    var title = 'Select a Date';
    var getLocation = function(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };

    var calendar_struct = '<h3>' + this.heading + '</h3> <span class="qt-ico qt-ico-xs qt-ico-cross close-popup" onclick="javascript:flightsDepartCalendar.hidePopup();"></span>';

    if (this.flexible) {
        var isChecked = (document.getElementById('searchOption').value == "true") ? "checked" : " ";
        calendar_struct += '<div class="form-radio-check dates-flexible"><input onClick="javascript:' + this.popupVarName() + '.flexibleCheck();" type="checkbox" ' + isChecked + ' id="' + this.inputNamePrefix + 'flexi" >  <label for="' + this.inputNamePrefix + 'flexi">Flexible with dates</label> </div>'
    }

    calendar_struct += '<div class="cal_wrapper" onmouseout="javascript:' + this.popupVarName() + '.mouseOut();" onmouseover="javascript:' + this.popupVarName() + '.mouseOver();">';
    if (window.navigator.userAgent.indexOf('MSIE 8') == -1) {
        jQuery(this.divCalendar).find('div.dupMonth').remove();
        if (slideSide == 'inc') {
            var currentMonthDiv, prevRaw;
            var firstMonDiv = jQuery(this.divCalendar).find('div.calendar')[0].children[0].innerHTML.split(' ')[0].toUpperCase();
            var actualMonth = new Date().getFullMonth();
            if ((firstMonDiv == actualMonth) && (!alreadyCreated)) {
                currentMonthDiv = jQuery(this.divCalendar).find('div.calendar')[0].innerHTML;
                prevRaw = '<div class="calendar tableCalendar dupMonth">' + currentMonthDiv + '</div>';
                //prevRaw = '';
                calendar_struct += '<div class="cal_nav"><a href="javascript:' + this.popupVarName() + '.decMonthYear()">&#171;</a></div><div class="cal_contents">' + prevRaw + raw + '</div><div class="cal_nav_rght"><a href="javascript:' + this.popupVarName() + '.incMonthYear();">&#187;</a></div></div>';
                //jQuery(this.divCalendar).find('div.calendar')[0].remove();
                alreadyCreated = true;
            } else {
                jQuery(this.divCalendar).find('div.calendar:first').remove();
                currentMonthDiv = jQuery(this.divCalendar).find('div.calendar')[0].innerHTML;
                prevRaw = '<div class="calendar tableCalendar dupMonth">' + currentMonthDiv + '</div>';
                calendar_struct += '<div class="cal_nav"><a href="javascript:' + this.popupVarName() + '.decMonthYear()">&#171;</a></div><div class="cal_contents">' + prevRaw + raw + '</div><div class="cal_nav_rght"><a href="javascript:' + this.popupVarName() + '.incMonthYear();">&#187;</a></div></div>';
            }
        } else {
            calendar_struct += '<div class="cal_nav"><a href="javascript:' + this.popupVarName() + '.decMonthYear()">&#171;</a></div><div class="cal_contents">' + raw + '</div><div class="cal_nav_rght"><a href="javascript:' + this.popupVarName() + '.incMonthYear();">&#187;</a></div></div>';
        }
    } else {
        calendar_struct += '<div class="cal_nav"><a href="javascript:' + this.popupVarName() + '.decMonthYear()">&#171;</a></div><div class="cal_contents">' + raw + '</div><div class="cal_nav_rght"><a href="javascript:' + this.popupVarName() + '.incMonthYear();">&#187;</a></div></div>';
    }
    /* QDIRECTSMI - 1877 end*/
    this.displayDate.setMonth(this.displayDate.getMonth() - 2);
    return calendar_struct;
}

Calendar.prototype.hoverRanges = function(hoveredObj) {
    var $this =this;
    jQuery($this.divCalendar).find('.dateRange').each(function() {
        jQueryjQuery(this).removeClass("dateRangeHover");
        jQuery(this).addClass('date');
    });
    var hoveredDateAttr = jQuery(hoveredObj).attr('date');
    var departDateAttr = $this.otherCalendar.displayDate;
    var hoveredDate = new Date(hoveredDateAttr);
    var departDate = new Date(departDateAttr);
    var tempDateRanges = [new DateRange(departDate, hoveredDate)];
    jQuery($this.divCalendar).find("div.date").each(function() {
        var currentDateAttr = jQuery(this).attr('date');
        var currentDate = new Date(currentDateAttr);
        if (tempDateRanges != null && currentDate.dateWithinRanges(tempDateRanges)) {
            if ((jQuery(hoveredObj).find('i').length == 0) && (!jQuery(hoveredObj).hasClass('dateRange'))) {
                jQuery('.lastHover').removeClass('lastHover');
                this.className = "tableTd date dateRangeHover lastHover";
            } else if (!jQuery(hoveredObj).hasClass('dateRange')) {
                this.className = "tableTd date dateRangeHover";
            }
        } else {
            this.className = "tableTd date";
        }
    });
}

Calendar.prototype.touchEvent = function() {
    var calthis = this;
    //detecting swipe direction
    this.divCalendar.children[1].addEventListener('touchstart', handleTouchStart, false);
    this.divCalendar.children[1].addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
            if (xDiff > 0) {
                calthis.incMonthYear();
                //calback function
                //incMonthYear()
            } else {
                calthis.decMonthYear();
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
}

Calendar.prototype.millisecondTimeout = 500;
Calendar.prototype.useIePopup = false; // IE-Popups used in IE 5.5 onwards
Calendar.prototype.popupVarName = function() {
    return (this.useIePopup ? ('parent.' + this.varName) : this.varName);
}
Calendar.prototype.popupCreate = function() {
    this.clearPopupTimers();
    this.mouseOverCounter = 0;
    this.popupX = 0;
    this.popupY = this.dayField.offsetHeight + 1;
    if (this.useIePopup) {
        this.popup = this.win.createPopup();
        var link = this.popup.document.createElement('link');
        link.href = this.calendarCSS;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        this.popup.document.body.parentNode.insertBefore(link, this.popup.document.body);
        this.popup.document.body.innerHTML = this.divCalendar.innerHTML;
        this.popup.show(0, this.monthYearField.offsetHeight, jQuery(this.divCalendar).width(), jQuery(this.divCalendar).height() + 2, this.monthYearField);
    }
    else {
        var temp = this.monthYearField;
        this.popup = this.divCalendar;
        this.textField.select();
        jQuery('div.calendarPage').removeClass('showcal');
        this.updateCell(this.displayDate,true);
        jQuery(this.popup).addClass('showcal');
        if (isiPad) {
            this.touchEvent();
        }
    }
    this.mouseOver();
}
Calendar.prototype.mouseOver = function() {
    this.mouseOverCounter++;
}
Calendar.prototype.mouseOut = function() {
    this.mouseOverCounter--;
    var objName;

    ((jQuery('body').find('.searchFragment').html() != null || location.href.indexOf('showHeader=0') > -1) && (this.useIePopup)) ?
    objName = this.popupVarName().split('.')[1]:
        objName = this.popupVarName();

    this.popupTimers.push(window.setTimeout(objName + '.timeoutPopup();', this.millisecondTimeout));
}
Calendar.prototype.timeoutPopup = function() {
    if (this.mouseOverCounter <= 0) {
        this.hidePopup();
    }
}
Calendar.prototype.clearPopupTimers = function() {
    while (this.popupTimers.length > 0) {
        window.clearTimeout(this.popupTimers.shift());
    }
    this.mouseOverCounter = 0;
}
Calendar.prototype.hidePopup = function() {
    this.clearPopupTimers();
    if (this.popup != null) {
        if (this.useIePopup) {
            this.popup.removeClass('showcal');
        } else {
            jQuery(this.popup).removeClass('showcal');
        }
    }
    this.popup = null;
}
Calendar.prototype.popupToggle = function() {
    if (this.popup == null && !this.dayField.disabled && !this.monthYearField.disabled) {
        //  jQuery('div.calendarPage').hide();
        this.popupCreate();
    } else {
        this.hidePopup();
    }
}
Calendar.prototype.setEnabled = function(enabled) {
    if (this.dayField.type != 'hidden') {
        this.dayField.disabled = (!enabled);
    }
    if (this.monthYearField.type != 'hidden') {
        this.monthYearField.disabled = (!enabled);
    }
    if (this.hourField.type != 'hidden') {
        this.hourField.disabled = (!enabled);
    }
    if (enabled) {
        this.calendarIcon.className = this.calendarIcon.className.replace(/disabled/ig, '');
        this.textField.className = this.textField.className.replace(/disabled/ig, '');
        this.textField.disabled = false;
    } else {
        this.calendarIcon.className += ' disabled';
        this.textField.className += ' disabled';
        this.calendarIcon.onclick = "javascript(void:0)";
        this.textField.onclick = "javascript(void:0)";
        this.textField.disabled = true;
    }


}
Calendar.prototype.createCalendar = function(obj) {
    this.fieldTag = this.doc.getElementById(this.fieldTagId);
    while (this.fieldTag.hasChildNodes()) {
        this.fieldTag.removeChild(this.fieldTag.firstChild);
    }
    this.calendarTag = ((this.calendarTagId == null) ? null : this.doc.getElementById(this.calendarTagId));
    while (this.calendarTag != null && this.calendarTag.hasChildNodes()) {
        this.calendarTag.removeChild(this.calendarTag.firstChild);
    }
    var temp = this.doc.createElement('div');
    temp.className = 'qt-calendar-wrap';
    temp.appendChild(this.monthYearField);
    temp.appendChild(this.dayField);
    if (this.showCalendarIcon) {
        temp.appendChild(this.calendarIcon);
    }
    temp.appendChild(this.hourField);
    temp.appendChild(this.yearField);
    temp.appendChild(this.monthField);
    temp.appendChild(this.timeField);
    temp.appendChild(this.formattedField);
    temp.appendChild(this.bookLeadFormattedField);
    temp.appendChild(this.textField);
    temp.appendChild(this.dateFormatted);
    this.fieldTag.appendChild(temp);
    this.haveFieldsBeenInserted = true;
    this.update(this.startDate);
    if (obj) {
        if (this.showCalendarIcon || this.calendarTagId == null) {
            jQuery('#' + obj).prepend(this.divCalendar);
        } else {
            this.calendarTag.appendChild(this.divCalendar);
        }
    } else {
        if (this.showCalendarIcon || this.calendarTagId == null) {
            jQuery('#' + this.fieldTagId).prepend(this.divCalendar);
        } else {
            this.calendarTag.appendChild(this.divCalendar);
        }
    }
}
Calendar.prototype.setOnChangeCallback = function(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;
}
Calendar.prototype.getDate = function() {
    return (this.displayDate == null ? this.startDate : this.displayDate);
}
Calendar.prototype.setCalendarCSS = function(calendarCSS) {
    this.calendarCSS = calendarCSS;
}
Calendar.prototype.setDefaultHour = function(defaultHour) {
    this.defaultHour = defaultHour;
}
Calendar.prototype.setAnytime = function(value) {
    this.isAnytime = value;
    if (this.showHourField) {
        this.updateHourSelectOptions();
    } else {
        this.hourField.value = this.displayDate.getHours();
    }
}
Calendar.prototype.serialize = function() {
    return '' + this.getDate().getTime() + '-' + (this.hourRangeSelected ? 1 : 0) + '-' + (this.hasUserSetHour ? 1 : 0) + '-' + (this.isAnytimeSelected ? 1 : 0);
}
Calendar.prototype.deserialize = function(value) {
    var s = value.split('-');
    this.isAnytimeSelected = (s[3] == '1' ? true : false);
    this.hasUserSetHour = (s[2] == '1' ? true : false);
    this.hourRangeSelected = (s[1] == '1' ? true : false);
    this.update(new Date(parseInt(s[0])));
}
Calendar.prototype.showHours = function() {
    this.hourField.style.visibility = 'visible';
}
Calendar.prototype.hideHours = function() {
    this.updateHourOfDay('Anytime');
    this.hourField.style.visibility = 'hidden';
}


function Calendar(varName, inputIdPrefix, inputNamePrefix, dateRanges, fieldTagId, ShowTextField, showCalendarIcon, calendarTagId, heading, flexible, otherCalendar) {
    this.win = window;
    this.doc = document;
    this.varName = varName;
    this.fieldTagId = fieldTagId;
    this.calendarTagId = calendarTagId;
    this.isAnytime = false;
    this.isAnytimeSelected = true;
    this.dateRanges = dateRanges;
    this.startDate = dateRanges[0].from;
    this.endDate = dateRanges[dateRanges.length - 1].to;
    this.displayDate = null;
    this.inputIdPrefix = inputIdPrefix;
    this.heading = heading;
    this.inputNamePrefix = inputNamePrefix;
    this.showCalendarIcon = ((showCalendarIcon == true || showCalendarIcon == null) ? true : false);
    this.ShowTextField = ((ShowTextField == true || ShowTextField == null) ? true : false);
    this.onChangeCallback = null;
    this.hourRangeSelected = true;
    this.defaultHour = null;
    this.hasUserSetHour = false;
    this.haveFieldsBeenInserted = false;
    this.divCalendar = this.doc.createElement('div');
    this.divCalendar.id = this.inputIdPrefix + 'CalendarPage';
    this.divCalendar.className = 'calendarPage';
    // The formated YYYYmmDDHH00 date-time.
    this.formattedField = this.doc.createElement('input');
    this.formattedField.type = 'hidden';
    this.formattedField.name = inputNamePrefix + 'Formatted';
    this.formattedField.id = inputIdPrefix + 'Formatted';
    // Highlight depart date
    this.dateFormatted = this.doc.createElement('input');
    this.dateFormatted.type = 'hidden';
    this.dateFormatted.name = inputNamePrefix + 'DateFormatted';
    this.dateFormatted.id = inputIdPrefix + 'DateFormatted';
    // The minimum departure time formated YYYYmmDDHH00 date-time.
    this.bookLeadFormattedField = this.doc.createElement('input');
    this.bookLeadFormattedField.type = 'hidden';
    this.bookLeadFormattedField.name = inputNamePrefix + 'BookLeadFormatted';
    this.bookLeadFormattedField.id = inputIdPrefix + 'BookLeadFormatted';
    // The timeField stores the millisecond time since midnight 1st Jan 1970 (UTC).
    this.timeField = this.doc.createElement('input');
    this.timeField.type = 'hidden';
    this.timeField.name = inputNamePrefix + 'Time';
    this.timeField.id = inputIdPrefix + 'Time';
    this.yearField = this.doc.createElement('input');
    this.yearField.type = 'hidden';
    this.yearField.name = inputNamePrefix + 'Year';
    this.yearField.id = inputIdPrefix + 'Year';
    this.monthField = this.doc.createElement('input');
    this.monthField.type = 'hidden';
    this.monthField.name = inputNamePrefix + 'Month';
    this.monthField.id = inputIdPrefix + 'Month';
    this.monthYearField = this.doc.createElement('input');
    this.monthYearField.type = 'hidden';
    this.dayField = this.doc.createElement('input');
    this.dayField.type = 'hidden';
    this.hourField = this.doc.createElement('input');
    this.hourField.type = 'hidden';
    this.textField = this.doc.createElement('input');
    this.textField.name = inputNamePrefix + 'TextField';
    this.textField.id = inputIdPrefix + 'TextField';
    this.textField.type = 'text';
    this.textField.className = 'form-control';
    this.textField.autocomplete = 'off';
    this.textField.readonly = 'true';
    this.monthYearField.className = 'calMonthYear';
    this.monthYearField.name = inputNamePrefix + 'MonthYear';
    this.monthYearField.id = inputIdPrefix + 'MonthYear';
    this.dayField.className = 'calDay';
    this.dayField.name = inputNamePrefix + 'Day';
    this.dayField.id = inputIdPrefix + 'Day';
    this.hourField.className = 'calHour';
    this.hourField.name = inputNamePrefix + 'Hour';
    this.hourField.id = inputIdPrefix + 'Hour';
    this.calendarIcon = this.doc.createElement('div');
    this.calendarIcon.className = 'form-control-overlay';
    this.calendarIcon.innerHTML = '<span class="separate"></span><span class="qt-ico qt-ico-s qt-ico-calendar"></span>';
    this.calendarIcon.id = inputIdPrefix + 'PopupCalendarIcon';
    this.calendarIcon.onclick = new Function(varName + '.popupToggle()');
    this.textField.onfocus = new Function(varName + '.popupCreate()');
    this.flexible = flexible;
    this.calendarSelection = [new DateRange(this.startDate, this.startDate)];
    var obj = this;
    this.textField.onmouseup = function(evt) {
        return false;
    }
    this.textField.onkeydown = function(evt) {
        var evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        obj.onKeyDown(evt);
        if (charCode == 27) {
            obj.hidePopup();
        }
    };
    this.calendarIcon.onmouseover = new Function(varName + '.mouseOver()');
    if (Calendar.title)
        this.calendarIcon.title = Calendar.title;
    else
        this.calendarIcon.title = "Click for a month-by-month calendar";
    this.mouseOverCounter = 0;
    this.popupTimers = new Array();
    this.popup = null;
    this.popupX = 0;
    this.popupY = 0;
    this.popupW = 0;
    this.popupH = 0;
    this.otherCalendar = otherCalendar;
}
Calendar.prototype.setDateRange = function(dateRanges) {
    this.dateRanges = dateRanges;
    this.startDate = dateRanges[0].from;
    this.endDate = dateRanges[dateRanges.length - 1].to;
    this.displayDate = null;
    this.update(this.startDate);
}

Calendar.prototype.flexibleCheck = function(dateRanges) {
    var isChecked = document.getElementById('searchOption').value;
    isChecked = (isChecked == "true") ? "false" : "true";
    document.getElementById('flexi').checked = (isChecked == "true") ? true : false;
    document.getElementById('searchOption').value = isChecked;
}

Calendar.prototype.markRanges = function(depCal, retCal) {
    var depDate = new Date(depCal.displayDate),
        retDate = new Date(retCal.displayDate);
    this.calendarSelection = [new DateRange(depDate, retDate)];
}

Calendar.prototype.onKeyDown = function(evt, varName) {

    evt = evt || window.event;
    var charCode = evt.which || evt.keyCode;
    if ((charCode == 13) || (charCode == 9)) {
        var inputVal = ((this.textField).value);
        var timestamp = inputVal;

        var n = timestamp.split("/");
        timestamp = n[1] + '/' + n[0] + '/' + n[2];
        timestamp = Date.parse(timestamp);
        if (isNaN(timestamp) == false) {
            timestamp = new Date(timestamp);
            this.update(timestamp);
            this.hidePopup();
            if (charCode == 9) {
                return true;
            }
        } else if ((this.displayDate).format(textDateDisplayFormat) == (this.textField).value) {
            if (charCode == 9) {
                jQuery('.calendarPage').removeClass('showcal');
                return true;
            }
        } else {
            alert(calendarErrMsg);
        }
        evt.preventDefault();
        return false;
    }
}
