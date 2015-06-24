calendar.controller('calendarController',
    function calendarController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.$on(messageService.messages.createCalendar, function(event, data) {
            $scope.title = data.title;
            $scope.schoolStartYear = data.startYear;
            $scope.schoolEndYear = ++data.startYear;
            $scope.currentYear = $scope.schoolStartYear;
            $scope.yearlyCalendar = dataService.getYearlyCalendar();
            // get calendar template
            // get months dictionary with month strings and indicies
            $scope.months = dataService.months;
            $scope.calendarInit();
        });

        $scope.$on(messageService.messages.viewCalendar, function(event, data) {
            $scope.calendarId = data.id;
            var date = data.get("calendarYear").split('-');
            $scope.schoolStartYear = date[0];
            $scope.schoolEndYear = date[1];
            $scope.currentYear = $scope.schoolStartYear;
            $scope.yearlyCalendar = data.get("calendarInfo");
            $scope.months = dataService.months;
            $scope.init();
        });

        // initialize current month and current year
        $scope.currentMonth = '';
        $scope.currentYear = '';

        var date = new Date();          // create date object
        var calendarIndex = 0;
        var currentMonth = 7;     // calendar will start in August and end in july

        $scope.calendarInit = function() {
            //$scope.init();
            while ((currentMonth + 1) != 7) {
                $scope.init();
                calendarIndex = (calendarIndex + 1) % 12;
                currentMonth = (currentMonth + 1) % 12;
            }
            $scope.init();
            calendarIndex = 0;
            currentMonth = 7;     // calendar will start in August and end in july
            $scope.currentMonth = 'August';
            $scope.currentYear = $scope.schoolStartYear;
            $scope.monthSwitch();
        };

        $scope.monthSwitch = function() {
            $scope.calendar = $scope.yearlyCalendar[calendarIndex];
            // get current, next and previous months
            $scope.currentMonth = _.invert($scope.months)[currentMonth];
            if ($scope.currentMonth === 'January')
                $scope.currentYear = $scope.schoolEndYear;
            if ($scope.currentMonth === 'December')
                $scope.currentYear = $scope.schoolStartYear;

            $scope.nextMonth = _.invert($scope.months)[(currentMonth+1)%12];
            $scope.previousMonth = _.invert($scope.months)[mod(currentMonth - 1, 12)];
        };

        $scope.init = function() {
            $scope.calendar = $scope.yearlyCalendar[calendarIndex];

            // get current, next and previous months
            $scope.currentMonth = _.invert($scope.months)[currentMonth];
            if ($scope.currentMonth === 'January')
                $scope.currentYear = $scope.schoolEndYear;
            if ($scope.currentMonth === 'December')
                $scope.currentYear = $scope.schoolStartYear;

            $scope.nextMonth = _.invert($scope.months)[(currentMonth+1)%12];
            $scope.previousMonth = _.invert($scope.months)[mod(currentMonth - 1, 12)];

            var numDays = new Date ($scope.currentYear, currentMonth + 1, 0).getDate();   // get the number of days for current month

            var firstDay = new Date ($scope.currentYear, currentMonth, 1).getDay();   // get the day of the week of the first day

            var currentDate = 1;      // of course, the first day of the month is the first

            // if the day of the week falls on Sunday
            if (firstDay == 0) {
                currentDate = 2;  // then we start on the second day
                firstDay = 1;   // and the day of the week is Monday
            }

            // if the day of the week falls on Saturday
            else if (firstDay == 6) {
                currentDate = 3;  // then we start on the third day
                firstDay = 1;
            }

            // initialize the calendar for the month
            for (var i = 0; i < 5; i++) {
                for (var j = firstDay - 1; j < 5; j++) {
                    $scope.calendar[i][j].day = currentDate;  // set the day to the current date;
                    $scope.calendar[i][j].title = $scope.currentMonth + ' ' + currentDate + ', ' + $scope.currentYear;

                    currentDate++; // move to the next day

                    // if it is friday, go ahead and skip to monday
                    if (j == 4) {
                        currentDate += 2;
                        firstDay = 1;
                    }

                    // once we have reached the end of the month, the calendar is done
                    if (currentDate > numDays)
                        break;
                }
            }
        };

        $scope.dayEvent = function(calendarDay) {
            if(!calendarDay.events)
                calendarDay.events = [];
            if(!calendarDay.color)
                calendarDay.color = {};

            $scope.events = calendarDay.events;
            $scope.dayColor = [];

            //$scope.colors = ['White', 'Blue', 'Green', 'Yellow', 'Red', 'Brown'];

            $scope.colors = dataService.colors;

            if (!_.isEmpty(calendarDay)) {
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    template: '<div class="row" ng-repeat="event in events track by $index">' +
                    '<input type="text"  ng-bind="add(events, event, $index)" ng-model="event">' +
                    '<a class="icon x" ng-click="delete(events, event, $index)">X</a>' +
                    '</div>' +
                    '<div class="list">' +
                    '<label class="item item-input item-select">' +
                    '<div class="input-label">' +
                    'Select Color for Day' +
                    '</div>' +
                    '<select ng-model="color" ng-change="changeColor(dayColor, color)" ng-options="k for (k, v) in colors">' +
                    '</select>' +
                    '</label>' +
                    '</div>',
                    title: calendarDay.title,
                    subTitle: 'Here are the events',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel',
                            onTap: function(e) {
                                return $scope.dayColor;
                            }
                        },
                        {
                            text: 'Add event',
                            type: 'button-balanced',
                            onTap: function(e) {
                                $scope.events.push('');
                                e.preventDefault();
                            }
                        },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                return $scope.dayColor;
                            }
                        }

                    ]
                });
                myPopup.then(function (res) {
                    calendarDay.events = _.without(calendarDay.events, "");
                    if(!_.isEmpty(res)) {
                        calendarDay.color = {'background-color': res[0]};
                    }
                });
            }
        };

        $scope.add = function(events, event, index) {
            events[index] = event;
        };

        $scope.delete = function(events, index) {
            events.splice(index, 1);
        };

        $scope.changeColor = function(dayColor, selectedColor) {
            dayColor.push(selectedColor);
            return dayColor;
        };

        $scope.next = function() {
            calendarIndex = (calendarIndex + 1) % 12;
            currentMonth = (currentMonth + 1) % 12;
            //$scope.init();
            $scope.monthSwitch();
        };

        $scope.previous = function() {
            calendarIndex = (calendarIndex - 1) % 12;
            currentMonth = mod(currentMonth - 1, 12);
            //$scope.init();
            $scope.monthSwitch();
        };

        function mod(n, m) {
            return ((n % m) + m) % m;
        }

        $scope.saveCalendar = function() {
            var calendar = {
                id: $scope.calendarId ? $scope.calendarId : '',
                title: $scope.title,
                year: $scope.schoolStartYear + '-' + $scope.schoolEndYear,
                info: $scope.yearlyCalendar
            };

            if ($scope.calendarId) {
                dataService.findCalendar($scope.calendarId).then(function(parseCalendar) {
                    dataService.saveEditCalendar(parseCalendar, calendar).then(function(result) {
                        viewService.goToPage('/home');
                        $timeout(function () {
                            toastService.success(messageService.toast.calendarSaved);
                            $rootScope.$broadcast(messageService.messages.calendarAdd);
                        });
                    });
                }, function(error) {
                    $timeout(function () {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            } else {
                dataService.saveCalendar(calendar).then(function (calendar) {
                    viewService.goToPage('/home');
                    $timeout(function () {
                        toastService.success(messageService.toast.calendarSaved);
                        $rootScope.$broadcast(messageService.messages.calendarAdd);
                    });
                }, function (error) {
                    $timeout(function () {
                        toastService.error(messageService.toast.error(error));
                    });
                });
            }
        };



    });
