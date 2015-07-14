// directive for editing an account
calendar.directive('pdfViewer', function ($rootScope, $location, $timeout, viewService, toastService, dataService, messageService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/pdf-viewer.html",
        controller: function($scope, viewService) {
            var self = 'pdfViewer';

            var myImage;
            var pdf = new jsPDF();
            var i = 1;
            var x = 0;
            var y = 0;

            var renderImage = function() {

                if (i == 13) {
                    //console.log(pdf);
                    pdf.save($scope.title);
                    sendEmail();
                } else {
                    $('#' + (i - 1)).remove();
                    //$timeout(function() {
                        html2canvas($('#' + i), {
                            onrendered: function (canvas) {
                                i++;
                                myImage = canvas.toDataURL('image/png');
                                pdf.addImage(myImage, 'png', 0, y, 170, 0);
                                y += 22.5;
                                renderImage();
                            },
                            width: 800,
                            height: 200
                        });
                    //}, 1000);
                }
            };

            $scope.getImage = function() {
                html2canvas($('#t'), {
                    onrendered: function (canvas) {
                        myImage = canvas.toDataURL('image/png');
                        pdf.addImage(myImage, 'png', 0, y, 200, 0);
                        y += 9;
                        renderImage();
                    },
                    width: 800,
                    height: 200
                });
            };

            var sendEmail = function() {

                var datauri = pdf.output('dataurlstring');
                console.log(datauri);
                // look in string and remove forbidden characters
                //var parseFile = new Parse.File('title.pdf', {base64: datauri});
                //console.log(parseFile);
                //
                //$scope.current.set("parseFile", parseFile);
                //$scope.current.save().then(function(calendar) {
                //    console.log(calendar);
                //}, function(error) {
                //    console.log(error);
                //});

                Parse.Cloud.run('sendEmail', { pdf: datauri, title: $scope.title}, {
                    success: function(result) {
                        console.log(result);
                    },
                    error: function(error) {
                        //toastService.error(messageService.messages.error(error));
                        console.log(error);
                    }
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
                $scope.current = data;
                //console.log($scope.current);
                $scope.calendars = data.get("calendarInfo");
                $scope.title = data.get("calendarYear") + ': ' + data.get("title");
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