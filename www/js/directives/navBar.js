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

                var myPopup = $ionicPopup.show({
                    template: '<div class="list">' +
                    '<label class="item item-input item-stacked-label>"' +
                        '<span class="input-label"></span>' +
                        '<input type="text" placeholder="Staff Calendar" ng-bind="checkTitle(data.title, error)" ng-model="data.title" required>' +
                    '</label>' +
                    '<label class="item item-input item-stacked-label>"' +
                        '<span class="input-label"></span>' +
                        '<input type="text" placeholder="2015" ng-bind="checkYear(data.startYear, error)" ng-model="data.startYear">' +
                    '</label>' +
                    '<h3 class="errorMsg" ng-if="error.status">{{error.msg}}</h3>' +
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

            $scope.logOut = function() {
                dataService.logOut();
            };

        }
    };
});