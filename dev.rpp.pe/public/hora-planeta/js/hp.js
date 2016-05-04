/*
  Marco Montenegro
*/

var count = 0;
var now = new Date("March 11, 2016 12:56:00");
var deadline = new Date("March 19, 2016 20:30:00");

function getTimeRemaining(endtime) {
  count++;
  var t = Date.parse(endtime) - (Date.parse(now) + 1000*count);
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

(function initializeClock(_class, endtime) {
  var clock = document.querySelectorAll(_class);
  var daysSpanD = clock[0].querySelector('.days');
  var hoursSpanD = clock[0].querySelector('.hours');
  var minutesSpanD = clock[0].querySelector('.minutes');
  var secondsSpanD = clock[0].querySelector('.seconds');

  var daysSpanM = clock[1].querySelector('.days');
  var hoursSpanM = clock[1].querySelector('.hours');
  var minutesSpanM = clock[1].querySelector('.minutes');
  var secondsSpanM = clock[1].querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);
    daysSpanD.innerHTML = ('0' + t.days).slice(-2);
    hoursSpanD.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpanD.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpanD.innerHTML = ('0' + t.seconds).slice(-2);

    daysSpanM.innerHTML = ('0' + t.days).slice(-2);
    hoursSpanM.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpanM.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpanM.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      document.getElementById('hora-planeta-d').style.display = 'none';
      document.getElementById('hora-planeta-d').style.display = 'none';
      location.reload();
    }

  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
})('.clock-hp', deadline);
