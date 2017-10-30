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

var savedAddress;

server.post('/api/messages', connector.listen());

// Do GET this endpoint to delivey a notification
server.get('/api/CustomWebApi', (req, res, next) => {
  sendProactiveMessage(savedAddress);
  res.send('triggered');
  next();
}
);



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
      session.send(
          `Reservation confirmed.<br/>${session.dialogData.reservationName} 
          booked a cab for ${moment(session.dialogData.reservationDate).format('DD MMM H:mm')}.`
        );
      session.endDialog();
  }
]);


// root dialog
bot.dialog('/', function(session, args) {
  
    savedAddress = session.message.address;
  
    var message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
    session.send(message);
    
    message = 'You can also make me send a message by accessing: ';
    message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
    session.send(message);
  
    setTimeout(() => {
     sendProactiveMessage(savedAddress);
    }, 5000);
  });


// send simple notification
function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}