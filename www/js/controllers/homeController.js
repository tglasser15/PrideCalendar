calendar.controller('homeController',
    function homeController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;
        $scope.calendars = [];

        $scope.init = function() {
            dataService.getCalendars().then(function(calendars) {
                $scope.calendars = calendars;
            });
        };

        $scope.init();

        $scope.viewCalendar = function(index) {
            viewService.goToPage('/calendars');
            $timeout(function() {
                $rootScope.$broadcast(messageService.messages.viewCalendar, $scope.calendars[index]);
            });
        };

        $scope.removeCalendar = function(index) {
            dataService.deleteCalendar($scope.calendars[index]).then(function(result) {
                $timeout(function() {
                   toastService.success(messageService.toast.calendarRemoved);
                    $scope.init();
                });

            }, function(error) {
                $timeout(function() {
                    toastService.error(messageService.toast.error(error));
                });

            });
        };

        $scope.viewPdf = function(index) {
            console.log(index);
        };

        $scope.$on(messageService.messages.calendarAdd, function(event, data) {
            $scope.init();
        });

    });
