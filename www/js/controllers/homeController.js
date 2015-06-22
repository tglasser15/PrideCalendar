calendar.controller('homeController',
    function homeController($scope, $rootScope, viewService, toastService, dataService, messageService, $timeout, $ionicPopup) {
        var self = this;

        $scope.calendar = dataService.calendar;

        $scope.calendar[0][0] = {
            day: '1',
            events: [
                'hello',
                'bye'
            ]
        };

    });
