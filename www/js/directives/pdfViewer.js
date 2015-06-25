// directive for editing an account
calendar.directive('pdfViewer', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/pdf-viewer.html",
        controller: function($scope, viewService) {
            var self = 'pdfViewer';

            $scope.getImage = function() {
                var myImage;

                html2canvas($('#canvas'), {
                    onrendered: function(canvas) {
                        myImage = canvas.toDataURL('image/png');
                        window.open(myImage);
                        var doc = new jsPDF();
                        doc.addImage(myImage, 'PNG', 15, 40, 180, 180);
                        doc.save('.pdf');
                    },
                    width: 1000,
                    height: 1000
                });
                //

            };

            $scope.getEvents = function(calendar) {
                calendar.events = [];
                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        _.each(calendar[i][j].events, function(event) {
                            //August 5, 2015
                            var str = calendar[i][j].title.split(' ');
                            var m = str[0].substring(0,3);
                            var d = str[1].substring(0,str[1].length-1);

                            calendar.events.push(
                                {
                                    day: m + ' ' + d + ": ",
                                    info: event
                                }
                            );
                        });
                    }
                }
                //$scope.events.push('hello');
                //console.log($scope.events);
            };

            $scope.$on(messageService.messages.viewPdf, function(event, data) {
                $scope.calendars = data;
                var i = 0;
                _.each($scope.calendars, function(calendar) {
                    $scope.getEvents(calendar);
                    calendar.month = $scope.months[i++];
                });
            });

            $scope.calendars = [];
            $scope.events = [];
            $scope.months = [
                "Aug.", "Sep.", "Oct.", "Nov.", "Dec.", "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul."
            ];

        }
    };
});