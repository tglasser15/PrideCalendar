calendar.directive('navBar', function ($location, $timeout, $rootScope, viewService, toastService, dataService, messageService, $ionicPopup) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/nav-bar.html",
        controller: function($scope) {
            var self = 'navBar';  // name of modal

            // closing the modal
            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.openCalendar = function() {
                $scope.data = {};
                $scope.error = {
                    msg: '',
                    status: false
                };
                $scope.type = ["staff", "student"];

                var myPopup = $ionicPopup.show({
                    template: '<div class="list">' +
                    '<label class="item item-input item-stacked-label>"' +
                        '<span class="input-label"></span>' +
                        '<input type="text" placeholder="Staff Calendar" ng-bind="checkTitle(data.title, error)" ng-model="data.title" required>' +
                    '</label>' +
                    '<label class="item item-input item-stacked-label>"' +
                        '<span class="input-label"></span>' +
                        '<input type="text" placeholder="2015" ng-bind="checkYear(data.startYear, error)" ng-model="data.startYear" required>' +
                    '</label>' +
                    '<h3 class="errorMsg" ng-if="error.status">{{error.msg}}</h3>' +
                    '<label class="item item-radio">' +
                        '<input ng-model="data.calType" ng-value="type[0]" type="radio" name="group" required>' +
                        '<div class="item-content">'+
                            'Staff Calendar' +
                        '</div>' +
                        '<i class="radio-icon ion-checkmark"></i>' +
                    '</label>' +
                    '<label class="item item-radio">' +
                        '<input ng-model="data.calType" ng-value="type[1]" type="radio" name="group" required>' +
                        '<div class="item-content">'+
                            'Student Calendar' +
                        '</div>' +
                        '<i class="radio-icon ion-checkmark"></i>' +
                    '</label>' +
                    '</div>',
                    title: 'Please enter title and school start year',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel',
                            onTap: function (e) {
                                return '';
                            }
                        },
                        {
                            text: '<b>Go!</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $scope.checkYear($scope.data.startYear, $scope.error);
                                if ($scope.error.status)
                                    e.preventDefault();
                                else
                                    return $scope.data;
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
                    if (!$scope.error.status && res) {
                        console.log(res);
                        viewService.goToPage('/calendars');
                        $timeout(function () {
                            $rootScope.$broadcast(messageService.messages.createCalendar, res);
                        });
                    }
                });
            };

            $scope.checkYear = function(year, error) {
                if (year.length != 4) {
                    error.msg = 'invalid length';
                } else if (year.match(/[a-z]/i)) {
                    error.msg = 'contains letters';
                } else if (!year.match(/^(19|20)\d{2}$/)) {
                    error.msg = 'not a valid year';
                } else {
                    error.msg = '';
                }

                error.msg ? error.status = true : error.status = false;
            };

            $scope.checkTitle = function(title, error) {
                if (!title)
                    error.msg = 'missing title';
                else
                    error.msg = '';
                error.msg ? error.status = true : error.status = false;
            };

            $scope.checkType = function(type) {
                console.log(type);
            };

            $scope.logOut = function() {
                dataService.logOut();
            };

        }
    };
});