// contains all local data storage, get and set functions
calendar.factory('dataService', function ($location, $timeout, $rootScope, messageService, viewService, toastService) {
    // set: window.localStorage['teams'] = JSON.stringify(teams);
    // get: return JSON.parse(window.localStorage['teams'] || '[]');
    var

        calendarTable = Parse.Object.extend("Calendars")

        , calendar = [
          [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}]
        ]

        , getYearlyCalendar = function() {
            var year = [];
            for (var i = 0; i < 12; i++)
                year.push(jQuery.extend(true, {}, calendar));
            return jQuery.extend(true, [], year);
        }

        , colors = {
                White: '#fff',
                Green: '#b4c17b',
                Brown: '#DB9356',
                Blue: '#3232FF',
                Aqua: '#00ffff',
                Yellow: '#ffff00',
                Orange: '#ffa500'
        }
        , months = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11
        }

        // other functions
        , findCalendar = function(id) {
            var query = new Parse.Query(calendarTable);
            query.equalTo("objectId", id);
            return query.first();
        }

        , saveCalendar = function(calendar) {
            var newCalendar = new calendarTable();
            newCalendar.set("title", calendar.title);
            newCalendar.set("calendarYear", calendar.year);
            newCalendar.set("calendarInfo", calendar.info);
            return newCalendar.save();
        }

        , saveEditCalendar = function(parseCalendar, calendar) {
            parseCalendar.set("calendarInfo", calendar.info);
            return parseCalendar.save();
        }

        , getCalendars = function() {
            var query = new Parse.Query(calendarTable);
            return query.find();
        }

        , deleteCalendar = function(calendar) {
            return calendar.destroy();
        }

        , logIn = function(user) {
            return Parse.User.logIn(user.email, user.password);
        }

        , logOut = function() {  //on logout, clear local storage for next visit
            Parse.User.logOut();
            viewService.goToPage('/login');
        }

        ; return {
        calendar: calendar
        , getYearlyCalendar: getYearlyCalendar
        , colors: colors
        , months: months
        , findCalendar: findCalendar
        , saveCalendar: saveCalendar
        , saveEditCalendar: saveEditCalendar
        , getCalendars: getCalendars
        , deleteCalendar: deleteCalendar
        , logIn: logIn
        , logOut: logOut
    }

});