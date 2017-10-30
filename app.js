var restify = require('restify');
var builder = require('botbuilder');
var moment = require('moment');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "bfde944e-bc00-44fe-98db-84c3ea636e7d",
    appPassword: "YGWTqwqDckRLmOdkKmkYdSX"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



var bot = new builder.UniversalBot(connector, [
  function (session) {
      session.send("Sure! I can book that for you");
      builder.Prompts.time(session, "What time do want it to be booked?");
  },

  function (session, results) {
      session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
      builder.Prompts.text(session, "Who's name will this reservation be under?");
  },
  function (session, results) {
      session.dialogData.reservationName = results.response;
      // Process request and display reservation details
      // session.send(`Reservation confirmed.<br/>${session.dialogData.reservationName} booked a cab for ${moment(session.dialogData.reservationDate).format('DD MMM H:mm')}.`);


      var msg = new builder.Message(session)
      .speak('Reservation confirmed')
      .inputHint(builder.InputHint.ignoringInput);

      session.send(msg).endDialog();

      //session.endDialog();
  }
]);