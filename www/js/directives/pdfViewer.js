// directive for editing an account
calendar.directive('pdfViewer', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/pdf-viewer.html",
        controller: function($scope, viewService) {
            var self = 'pdfViewer';

            var myImage;
            var doc = new jsPDF();
            var i = 1;
            var pos = 0;

            var pdf = function() {
                doc.save('.pdf');
            };

            var renderImage = function() {
                if (i == 13) {
                    console.log('finished');
                    pdf();
                } else {
                    html2canvas($('#' + i), {
                        onrendered: function (canvas) {
                            console.log(i);
                            console.log(pos);
                            myImage = canvas.toDataURL('image/png');
                            doc.addImage(myImage, 'PNG', 0, pos, 0, 0);
                        },
                        width: 1000,
                        height: 1000
                    }).then(function (result) {
                        i++;
                        pos += 30;
                        renderImage();
                    });
                }
            };

            $scope.getImage = function() {
                var promise = new Promise(function(resolve, reject) {
                    renderImage();
                });

                promise.then(function(result) {
                    result.save('.pdf');
                }, function(error) {
                    console.log(error);
                });

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
                    calendar.id = i;
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