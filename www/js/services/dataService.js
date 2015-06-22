// contains all local data storage, get and set functions
calendar.factory('dataService', function ($location, $timeout, $rootScope, messageService, viewService, toastService) {
    // set: window.localStorage['teams'] = JSON.stringify(teams);
    // get: return JSON.parse(window.localStorage['teams'] || '[]');
    var
        calendar = [
          [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}],
            [{},{},{},{},{}]
        ];

        // other functions
        logIn = function(user) {
            return Parse.User.logIn(user.email, user.password);
        }

        , logOut = function() {  //on logout, clear local storage for next visit
            Parse.User.logOut();
            viewService.goToPage('/login');
        }

        ; return {
        calendar: calendar
        , logIn: logIn
        , logOut: logOut
    }

});