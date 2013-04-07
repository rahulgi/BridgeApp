Indicators = new Meteor.Collection("indicators");

/*
Departments = new Meteor.collection("departments");
People = new Meteor.Collection("people");
*/

/*
if (Meteor.isServer) {
  if (Players.find().cound() === 0) {
    var test = {
      "numbers": ["9999999999", "8888888888"],
      "suid": ["rahulgi"],
      "afiiliations": [{"Department": "Computer Science"}], 
    };
  }
}
*/

var router;
var tstrings = ["Concerning statements",
                "Behavioral cues",
                "Events/Situational cues",
                "Feelings"];
var lstrings = [
    ["Talking about suicide or discussing thoughts of suicide",
      "Wish I were dead",
      "Going to end it all",
      "Won't be around much longer",
      "Can't go on",
      "Soon they won't have to worry about me"],
    ["Has or looking for lethal means to kill oneself",
      "Social withdrawal",
      "Substance abuse",
      "Not sleeping",
      "Recklessness",
      "Putting affairs in order",
      "Rejecting help"],
    ["Loss of someone close",
      "Loss of academic opportunities",
      "Fear of negative consequences",
      "Depression"],
    ["Hopelessness",
      "Despair",
      "Shame",
      "Humiliation",
      "Purposelessness"]
  ];

template_helpers = {
  main: function () { return Session.get('mode') === undefined; },
  title: function () { return _.range(tstrings.length); },
  tstring: function (t) { return tstrings[t]; },
  item: function (t) { return _.range(lstrings[t].length); },
  lstring: function (t, l) { return lstrings[t][l]; },
  selected: function (t, l) {
    return template_helpers.selected_with_id(t, l, Session.get('id'));
  },
  selected_with_id: function (t, l, id) {
    var concat = t + '_' + l;
    var param = {};
    param[concat] = true;
    param['_id'] = id;
    if (Indicators.findOne(param))
      return "class=selected";
    return '';
  },
  url: function () {
    return window.location.protocol + "//" + window.location.host + "/" + Session.get('id');
  }
};

if (Meteor.isClient) {
  Meteor.startup(function () {

    Meteor.autorun(function () { // Auto-update 'name'
      var id = Indicators.findOne(Session.get('id'));
      if (id)
        Session.set('name', id.name);
    });
    Meteor.autorun(function () {
      if (Session.get('mode') == 'edit') {
        if (Indicators.findOne({'_id': Session.get('id'), end: true})) {// This ID has already been ended - redirect to the viewing URL
          router.navigate(Session.get('id'), {trigger: true});
        } else {
          $('#alert').popover({
            html: true,
            trigger: 'manual',
            placement: 'bottom',
            content: function () {
              var content = '<div id="alert-popover">Are you sure you want to send an alert?<br />';
              if (Session.get('alerted'))
                content += '<div id="already-alerted" class="alert alert-error">You have already sent an alert.</div>';
              content += '<button class="btn btn-primary" onclick="Template.alert.alert()">Alert</button> \
                          <button class="pull-right btn">Cancel</button></div>';
              return content;
            }
          }).click(function (e) {
            e.stopPropagation();
            $(this).popover('show');
          });

          $('#end').popover({
            html: true,
            trigger: 'manual',
            placement: 'bottom',
            content: function () {
              var content = '<div id="end-popover">Are you sure you want to end this session? You will no longer be able to edit it.<br />';
              if (!Session.get('alerted'))
                content += '<div id="not-alerted" class="alert alert-error">You have not alerted yet. \
                            <div class="text-center"><button id="alerted-from-end" class="btn btn-danger" onclick="return Template.alert.alert()">Alert now</button></div></div>';
              content += '<button class="btn btn-primary" onclick="Template.alert.end()">End</button> \
                          <button class="pull-right btn">Cancel</button></div>';
              return content;
            }
          }).click(function (e) {
            e.stopPropagation();
            $(this).popover('show');
          });

          $('html').click(function (e) {
            if (e.srcElement.id != 'alerted-from-end') {
              $('#alert').popover('hide');
              $('#end').popover('hide');
            }
          });
        }
      }
    });
    
    Meteor.autorun(function () {
      if (Indicators.findOne({'_id': Session.get('id'), alert: true})) 
        Session.set('alerted', true);
      else
        Session.set('alerted', false);
    });


    var Router = Backbone.Router.extend({
      routes: {
        ':id/edit': 'edit',
        ':id': 'view',
        '': 'main'
      }
    });
    router = new Router;
    router.on('route:edit', function (id) {
      Session.set('id', id);
      Session.set('mode', 'edit');
    });
    router.on('route:view', function (id) {
      Session.set('id', id);
      Session.set('mode', 'view');
    });
    router.on('route:main', function (id) {
      Session.set('mode', undefined);
    });
    Backbone.history.start({pushState: true});
  });

  handleIndicatorClick = function (t, l) {
    var concat = t + '_' + l;
    var param = {};
    param[concat] = true;
    // if (Indicators.findOne({'_id': Session.get('id'), para TODO
    if (elem.classList.contains('selected'))
      Indicators.update(Session.get('id'), {$unset: param});
    else
      Indicators.update(Session.get('id'), {$set: param});
  }

  // Template.body.helpers(template_helpers);
  // Template.body.events({
  //   'click': function (e) {
  //     var elem = e.toElement;
  //     if (Session.get('mode') === undefined && elem.tagName == 'BUTTON') { // Clicked on continue button on home page
  //       var name = document.getElementById('name').value;
  //       if (name == '') {
  //         document.getElementById('name').style['border-color'] = 'red';
  //         return;
  //       }
  //       Session.set('name', name);
  //       var userid = Indicators.insert({date: new Date(), name: name});
  //       router.navigate(userid + '/edit', {trigger: true});
  //       return;
  //     } else if (Session.get('mode') != 'edit')
  //       return;
  //     var clicked = e.toElement.dataset;
  //     if (Object.keys(clicked).length !== 0) { // clicked is non-empty - it is a <li>
  //       var concat = clicked.title + '_' + clicked.item;
  //       var param = {};
  //       param[concat] = true;
  //       if (elem.classList.contains('selected'))
  //         Indicators.update(Session.get('id'), {$unset: param});
  //       else
  //         Indicators.update(Session.get('id'), {$set: param});
  //     }
  //   }
  // });

  // Template.alert.alert = function (e) {
  //   Indicators.update(Session.get('id'), {$set: {alert: true}});
  //   Meteor.call("alert", Session.get('id'), Session.get('name'));
  //   $('#not-alerted').hide();
  // }
  // Template.alert.end = function () {
  //   Indicators.update(Session.get('id'), {$set: {end: true}});
  // }
  // Template.alert.edit = function () {
  //   return Session.get('mode') == 'edit';
  // }
}

if (Meteor.isServer) {
  Meteor.methods({
    alert: function (id, name) {
      console.log('Alert!');
      var url = Meteor.absoluteUrl(id);
      // Text
      // 
      // Meteor.http.post('https://api.twilio.com/2010-04-01/Accounts/AC2694cc35ac095be7bf2f8232fb626636/SMS/Messages.json', {
      //   params:{From: '+19704564789', To: '', Body: 'Suicide call alert at ' + url},
      //   auth: 'AC2694cc35ac095be7bf2f8232fb626636:3a8bc1e10210c2c9566299166021e176'
      // }, function (err, result) {
      //   if (err)
      //     console.log(result);
      // });
      
      // Email
      // process.env.MAIL_URL = 'smtp://postmaster%40bridge.mailgun.org:4h54dq73x6f1@smtp.mailgun.org:587';
      // var body = name + " is on call and is alerting you to a suicide call.";
      // body += "The following items from the checklist have been selected:<br />";
      // for (var i in template_helpers.title()) {
      //   body += "<h3>" + template_helpers.tstring(i) + "</h3>";
      //   body += "<ul>";
      //   for (var j in template_helpers.item(i)) {
      //     if (template_helpers.selected_with_id(i, j, id))
      //       body += "<li>" + template_helpers.lstring(i, j) + "</li>";
      //   }
      //   body += "</ul>";
      // }
      // body += 'You can see the live checklist at <a href="' + url + '">' + url + '</a>.';

      // Email.send({
      //   from: 'thebridgepeercounseling@gmail.com',
      //   to: '',
      //   subject: 'Suicide Alert',
      //   html: body
      // });
    }
  });
}

