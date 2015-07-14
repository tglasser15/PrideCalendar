
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("sendEmail", function(request, response) {

    var pdf = request.params.pdf;
    var sendgrid = require("sendgrid");
    sendgrid.initialize('tglasser15', 'S4mlnNPIRqiMVi9A6PJO1Q');
    var email = new sendgrid.Email();

    email.addTo("parent@mailinator.com");
    email.setFrom("tommy@test.org");
    email.setSubject("Sending with SendGrid is Fun");
    email.setHtml("and easy to do anywhere, even with Node.js " + pdf);

    sendgrid.send(email).then(function(email) {
        response.success('worked');
    }, function(error) {
        response.error(error);
    });

});
