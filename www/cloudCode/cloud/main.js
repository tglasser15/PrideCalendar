
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  var sendgrid = require("sendgrid");
  sendgrid.initialize("alecm00re", "$occerStats123"); // email authorization
    response.success("Hello world!");
});
