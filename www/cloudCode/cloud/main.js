
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("sendEmail", function(request, response) {

    console.log(request);
    var pdf = request.params.pdf;
    var title = request.params.title;

    var sendgrid = require("sendgrid");
    sendgrid.initialize('tglasser15', '1429665-t');

    var email = sendgrid.Email({to: 'parent@mailinator.com'});
    email.setFrom('no-reply@prideprepschool.org');
    email.setFromName('Premier Stats');
    email.setSubject('Welcome to Premier Stats!');
    email.setHTML('hello');
    email.addFile({
        filename: 'title.pdf',
        content:  pdf
    });

    sendgrid.send(email).then(function(email) {
        response.success('worked');
    }, function(error) {
        response.error(error);
    });

});
