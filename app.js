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
      builder.Prompts.choice(session, 'What card would like to test?', CardNames, {
          maxRetries: 3,
          retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
      });
  },
  function (session, results) {

      // create the card based on selection
      var selectedCardName = results.response.entity;
      var card = createCard(selectedCardName, session);

      // attach the card to the reply message
      var msg = new builder.Message(session).addAttachment(card);
      session.send(msg);
  }
]);

var HeroCardName = 'Hero card';
var ThumbnailCardName = 'Thumbnail card';
var ReceiptCardName = 'Receipt card';
var SigninCardName = 'Sign-in card';
var AnimationCardName = "Animation card";
var VideoCardName = "Video card";
var AudioCardName = "Audio card";
var CardNames = [HeroCardName, ThumbnailCardName, ReceiptCardName, SigninCardName, AnimationCardName, VideoCardName, AudioCardName];

function createCard(selectedCardName, session) {
  switch (selectedCardName) {
      case HeroCardName:
          return createHeroCard(session);
      case ThumbnailCardName:
          return createThumbnailCard(session);
      case ReceiptCardName:
          return createReceiptCard(session);
      case SigninCardName:
          return createSigninCard(session);
      case AnimationCardName:
          return createAnimationCard(session);
      case VideoCardName:
          return createVideoCard(session);
      case AudioCardName:
          return createAudioCard(session);
      default:
          return createHeroCard(session);
  }
}

function createHeroCard(session) {
  return new builder.HeroCard(session)
      .title('BotFramework Hero Card')
      .subtitle('Your bots — wherever your users are talking')
      .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
      .images([
          builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
      ])
      .buttons([
          builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
      ]);
}

function createThumbnailCard(session) {
  return new builder.ThumbnailCard(session)
      .title('BotFramework Thumbnail Card')
      .subtitle('Your bots — wherever your users are talking')
      .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
      .images([
          builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
      ])
      .buttons([
          builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
      ]);
}

var order = 1234;
function createReceiptCard(session) {
  return new builder.ReceiptCard(session)
      .title('John Doe')
      .facts([
          builder.Fact.create(session, order++, 'Order Number'),
          builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
      ])
      .items([
          builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
              .quantity(368)
              .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
          builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
              .quantity(720)
              .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
      ])
      .tax('$ 7.50')
      .total('$ 90.95')
      .buttons([
          builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
              .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
      ]);
}

function createSigninCard(session) {
  return new builder.SigninCard(session)
      .text('BotFramework Sign-in Card')
      .button('Sign-in', 'https://login.microsoftonline.com');
}