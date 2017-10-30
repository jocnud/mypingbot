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


// Create your bot with a function to receive messages from the user
// Create bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
  session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
});

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
  var msg = new builder.Message(session);
  msg.attachmentLayout(builder.AttachmentLayout.carousel)
  msg.attachments([
      new builder.HeroCard(session)
          .title("Classic White T-Shirt")
          .subtitle("100% Soft and Luxurious Cotton")
          .text("Price is $25 and carried in sizes (S, M, L, and XL)")
          .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
          .buttons([
              builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
          ]),
      new builder.HeroCard(session)
          .title("Classic Gray T-Shirt")
          .subtitle("100% Soft and Luxurious Cotton")
          .text("Price is $25 and carried in sizes (S, M, L, and XL)")
          .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
          .buttons([
              builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
          ])
  ]);
  session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });


// var bot = new builder.UniversalBot(connector, [
//   function (session) {
//       session.send("Sure! I can book that for you");
//       builder.Prompts.time(session, "What time do want it to be booked?");
//   },

//   function (session, results) {
//       session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
//       builder.Prompts.text(session, "Who's name will this reservation be under?");
//   },
//   function (session, results) {
//       session.dialogData.reservationName = results.response;
//       // Process request and display reservation details
//       session.send(
//           `Reservation confirmed.<br/>${session.dialogData.reservationName} 
//           booked a cab for ${moment(session.dialogData.reservationDate).format('DD MMM H:mm')}.`
//         );

//       session.endDialog();
//   }
// ]);
