/*
    @nombre : CALENDAR RPP
    @autor : JOAN PERAMAS
    @version : 0.0.2
*/

var rppCalendarInit = function(config) {
    /** CORE CALENDAR **/
    function Calendar ( options ) {
    	options = options || {};

    	this.startDate = options.startDate;
    	this.endDate = options.endDate;
    	this.maxInterval = options.maxInterval;
    	this.maxConstraint = options.maxConstraint;
    	this.siblingMonths = options.siblingMonths;
    	this.weekStart = options.weekStart;

    	if ( this.weekStart === undefined ) {
    		this.weekStart = 0;
    	}

    	this.date = new Date( 1986, 9, 14, 0, 0, 0 );
    }
    Calendar.prototype.getCalendar = function ( year, month ) {
    	this.date.setUTCFullYear( year );
    	this.date.setUTCMonth( month );
    	this.date.setUTCDate( 1 );

    	var calendar = [],
    		firstDay = this.date.getUTCDay(),
    		firstDate = - ( ( ( 7 - this.weekStart ) + firstDay ) % 7 ),
    		lastDate = Calendar.daysInMonth( year, month ),
    		lastDay = ( ( lastDate - firstDate ) % 7 ),
    		lastDayLastMonth = Calendar.daysInMonth( year, month - 1 ),
    		i = firstDate,
    		max = ( lastDate - i ) + ( lastDay != 0 ? 7 - lastDay : 0 ) + firstDate,
    		currentDay,
    		currentDate,
    		currentDateObject,
    		otherMonth,
    		otherYear;

    	while ( i < max ) {
    		currentDate = i + 1;
    		currentDay = ( ( i < 1 ? 7 + i : i ) + firstDay ) % 7;
    		if ( currentDate < 1 || currentDate > lastDate ) {
    			if ( this.siblingMonths ) {
    				if ( currentDate < 1 ) {
    					otherMonth = month - 1;
    					otherYear = year;
    					if ( otherMonth < 0 ) {
    						otherMonth = 11;
    						otherYear --;
    					}
    					currentDate = lastDayLastMonth + currentDate;
    				}
    				else if ( currentDate > lastDate ) {
    					otherMonth = month + 1;
    					otherYear = year;
    					if ( otherMonth > 11 ) {
    						otherMonth = 0;
    						otherYear ++;
    					}
    					currentDate = i - lastDate + 1;
    				}
    				currentDateObject = {
    					day: currentDate,
    					weekDay: currentDay,
    					month: otherMonth,
    					year: otherYear,
    					siblingMonth: true
    				};
    			}
    			else {
    				currentDateObject = false;
    			}
    		}
    		else {
    			currentDateObject = {
    				day: currentDate,
    				weekDay: currentDay,
    				month: month,
    				year: year
    			};
    		}

    		if ( currentDateObject && this.startDate ) {
    			currentDateObject.selected = this.isDateSelected( currentDateObject );
    		}

    		calendar.push( currentDateObject );
    		i ++;
    	}

    	return calendar;
    };
    Calendar.prototype.isDateSelected = function ( date ) {
    	if ( date.year == this.startDate.year && date.month == this.startDate.month && date.day == this.startDate.day ) {
    		return true;
    	}
    	else if ( this.endDate ) {
    		if ( date.year == this.startDate.year && date.month == this.startDate.month && date.day < this.startDate.day ) {
    			return false;
    		}
    		else if ( date.year == this.endDate.year && date.month == this.endDate.month && date.day > this.endDate.day ) {
    			return false;
    		}
    		else if ( date.year == this.startDate.year && date.month < this.startDate.month ) {
    			return false;
    		}
    		else if ( date.year == this.endDate.year && date.month > this.endDate.month ) {
    			return false;
    		}
    		else if ( date.year < this.startDate.year ) {
    			return false;
    		}
    		else if ( date.year > this.endDate.year ) {
    			return false;
    		}
    		return true;
    	}
    	return false;
    };
    Calendar.prototype.setStartDate = function ( date ) {
    	this.startDate = date;
    };
    Calendar.prototype.setEndDate = function ( date ) {
    	this.endDate = date;
    };
    Calendar.prototype.setDate = Calendar.prototype.setStartDate;
    Calendar.interval = function ( date1, date2 ) {
    	var oDate1 = new Date( 1986, 9, 14, 0, 0, 0 ), oDate2 = new Date( 1986, 9, 14, 0, 0, 0 );

    	oDate1.setUTCFullYear( date1.year );
    	oDate1.setUTCMonth( date1.month );
    	oDate1.setUTCDate( date1.day );

    	oDate2.setUTCFullYear( date2.year );
    	oDate2.setUTCMonth( date2.month );
    	oDate2.setUTCDate( date2.day );

    	return Math.abs( Math.ceil( ( oDate2.getTime() - oDate1.getTime() ) / 86400000 ) ) + 1;
    };
    Calendar.daysInMonth = function ( year, month ) {
    	if ( month == -1 || month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11 ) {
    		return 31;
    	}
    	else if ( month == 3 || month == 5 || month == 8 || month == 10 ) {
    		return 30;
    	}
    	else if ( month == 1 ) {
    		return 28 + Calendar.isLeapYear( year );
    	}
    };
    Calendar.isLeapYear = function ( year ) {
    	return ( ( year % 4 == 0 ) && ( year % 100 != 0 ) ) || ( year % 400 == 0 );
    }

    /** BUILD CALENDAR HTML **/
    //MONTHS
    var months = "ENERO FEBRERO MARZO ABRIL MAYO JUNIO JULIO AGOSTO SEPTIEMBRE OCTUBRE NOVIEMBRE DICIEMBRE".split(" ");
    //ID
    var _id = document.getElementById('rpp-calendar');
    //LOCAL DATE
    var _dateLocal =  (_id.getAttribute('data-date-local')).split('-');
    var _dateLocalDay =  parseInt(_dateLocal[2]);
    var _dateLocalMonth =  parseInt(_dateLocal[1]) - 1;
    var _dateLocalYear =  parseInt(_dateLocal[0]);
    //YEAR SCOPE
    var _yearScope = _id.getAttribute('data-year-scope');
    //URL PATH
    var _path = _id.getAttribute('data-path');
    //DATE CURRENT
    var _dateCurrent =  (_id.getAttribute('data-date-current')).split('-');
    var _dateCurrentDay =  parseInt(_dateCurrent[2]);
    var _dateCurrentMonth =  parseInt(_dateCurrent[1]) - 1;
    var _dateCurrentYear =  parseInt(_dateCurrent[0]);
    //CONFIG INIT
    var _dataConfig = {
        year: _dateCurrentYear,
        month: _dateLocalMonth,
        day: _dateLocalDay,
        path: _path
    };
    /*
    @config INIT CONFIG
    */
    var returnHTMLId = function(config) {
        var config = config;
        var year = config.year;
        var month = config.month;
        var day = config.day;
        var path = config.path;
        var _html = '<div class="date-controls group">' +
            '<i id="rpp-data--prev" class="date-prev icon-13"><span>Mes anterior</span></i>' +
            '<h3 id="rpp-name--month">' + months[month] + '</h3>' +
            '<i id="rpp-data--next" class="date-next icon-14"><span>Mes siguiente</span></i>' +
            '<select id="rpp-calendar--select" class="date-year" dir="rtl">';
        for (var k = 0; k < (_yearScope - 1); k++) {
            var isYear = (_dateLocalYear === (year - k))?'selected':'';
            _html += '<option ' + isYear +' value="' + (year - k) + '">' + (year - k) + '</option>';
        }
        _html += '</select>' +
            '</div>' +
            '<div id="rpp-calendar-table"></div>';
        _id.innerHTML = _html;
    };
    returnHTMLId(_dataConfig);

    //ID TABLE CALENDAR
    var _idTable = document.getElementById('rpp-calendar-table');
    //FUNC ADD 0 - FIX DAY
    /*
    @val DAY
    */
    var fixDay = function(val) {
        var val = val;
        if (val < 10) {
            var _val = '0' + String(val);
            return _val;
        } else {
            return val;
        }
    };
    //CLASS CALENDAR
    var cal = new Calendar();
    //CREATE HTML TABLE CALENDAR
    /*
    @config CONFIG HTML
    */
    var _returnHTML = function(config) {
        var config = config;
        var year = parseInt(config.year);
        var month = parseInt(config.month);
        var day = parseInt(config.day);
        var path = config.path;

        var m = cal.getCalendar(year, month);
        var _htmlTable = '<table>' +
            '    <thead>' +
            '        <tr>' +
            '            <th>Dom</th>' +
            '            <th>Lun</th>' +
            '            <th>Mar</th>' +
            '            <th>Mie</th>' +
            '            <th>Jue</th>' +
            '            <th>Vie</th>' +
            '            <th>Sáb</th>' +
            '        </tr>' +
            '    </thead>' +
            '    <tbody>';
        var __year = _dateCurrentYear,
            __month = _dateCurrentMonth,
            __day = _dateCurrentDay,
            __yearLocal = _dateLocalYear,
            __monthLocal = _dateLocalMonth,
            __dayLocal = _dateLocalDay,
            isToday = (__year === year) && (__month === month) && (__day === day),
            isMonth = (__year === year) && (month > __month); //MES MAYOR && AÑO IGUAL
        //VERIFICANDO EL MES ACTUAL
        var btnNext = document.getElementById('rpp-data--next');
        //ARRAY DIAS
        var arrPrev = [];
        for (var i = 0; i < Math.ceil(m.length/7); i++) {
            _htmlTable += '<tr>';
            var arrPrevInner = [];
            for (var j = 0; j < m.slice(i*7,(i+1)*7).length; j++) {
                var _day = i*7 + j;
                if((_day) < m.length){
                    arrPrevInner.push(m[_day]);
                    if (m[_day]) {
                        if((m[_day].day > __day) || isMonth){
                            //_htmlTable += '<td class="no-activo">' + fixDay(m[_day].day) + '</td>';
                            if(__month <= month && __year <= year){
                                _htmlTable += '<td class="no-activo">' + fixDay(m[_day].day) + '</td>';
                            }else{
                                _htmlTable += '<td class="si-activo ' +
                                    (((__year === year) && (__month === month) && (__day === m[_day].day))?
                                    "hoy-dia":
                                    "") +
                                    (((__yearLocal === year) && (__monthLocal === month) && (__dayLocal === m[_day].day))?
                                    " hoy-dia-local":
                                    "") +
                                    '"><a href='+ path+year+'-'+fixDay(month + 1)+'-'+fixDay(m[_day].day)+'>' +
                                    fixDay(m[_day].day) +
                                    '</a></td>';
                            }
                        }else{
                            _htmlTable += '<td class="si-activo ' +
                                (((__year === year) && (__month === month) && (__day === m[_day].day))?
                                "hoy-dia":
                                "") +
                                (((__yearLocal === year) && (__monthLocal === month) && (__dayLocal === m[_day].day))?
                                " hoy-dia-local":
                                "") +
                                '"><a href='+ path+year+'-'+fixDay(month + 1)+'-'+fixDay(m[_day].day)+'>' +
                                fixDay(m[_day].day) +
                                '</a></td>';
                        }
                    } else {
                        _htmlTable += '<td class="no-activo">' + '&nbsp;' + '</td>';
                    }
                }else{
                    break;
                }
            }
            _htmlTable += '</tr>';
            arrPrev.push(arrPrevInner);
        };
        _htmlTable += '</tbody>' +
            '</table>';
        _idTable.innerHTML = _htmlTable;
    };
    var _select = document.getElementById('rpp-calendar--select');
    _returnHTML({
        year: _select.value,
        month: _dateLocalMonth,
        day: _dateLocalDay,
        path: _path
    });
    var countMonth = _dateLocalMonth;
    _select.addEventListener('change', function(e) {
        var _select = this;
        var _val = _select.options[_select.selectedIndex].value;
        _returnHTML({
            year: _val,
            month: countMonth,
            day: _dateCurrentDay,
            path: _path
        });
    });
    //PREV AND NEXT
    var _prev = document.getElementById('rpp-data--prev');
    var _next = document.getElementById('rpp-data--next');
    var refreshMonth = function(type, month) {
        var type = type;
        var month = month;
        var _monthId = document.getElementById('rpp-name--month');
        _monthId.innerHTML = months[month];
        var _select = document.getElementById('rpp-calendar--select');
        var _dataConfig = {
            year: _select.value,
            month: month,
            day: _dateLocalDay,
            path: _path
        };
        _returnHTML(_dataConfig);
    };

    _prev.addEventListener('click', function(e) {
        if (countMonth != 0) {
            countMonth--;
            refreshMonth('prev', countMonth);
        }
    });
    _next.addEventListener('click', function(e) {
        if (countMonth != (months.length - 1)) {
            countMonth++;
            refreshMonth('next', countMonth);
        }
    });
}();
