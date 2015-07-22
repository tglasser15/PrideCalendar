
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("sendEmail", function(request, response) {

    console.log(request);
    var pdf = request.params.pdf;
    var title = request.params.title;

    var sendgrid = require("sendgrid");

    var email = sendgrid.Email({
        to: 'tommy@prideprepschool.org',
        from: 'no-reply@prideprepschool.org',
        subject: 'Report',
        files: [{filename: 'Report.pdf', content: pdf}],
        html: 'bla bla'
    });

    //var email = sendgrid.Email({to: 'parent@mailinator.com'});
    //email.setFrom('no-reply@prideprepschool.org');
    //email.setFromName('Premier Stats');
    //email.setSubject('Welcome to Premier Stats!');
    //email.setHTML('hello' + pdf.name);

    //email.addFile({
    //    filename: 'title.pdf',
    //    content:  pdf
    //});

    sendgrid.send(email).then(function(email) {
        response.success('worked');
    }, function(error) {
        response.error(error);
    });

});
