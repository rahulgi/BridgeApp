var blahblah = "HELLO";

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

if (Meteor.isClient) {
  Meteor.startup(function () {
    var Router = Backbone.Router.extend({
      routes: {
        ':id/edit': 'edit',
        ':id': 'view',
        '': 'main'
      },
      edit: function (id) {
        Session.set('id', id);
        Session.set('mode', 'edit');
      },
      view: function (id) {
        Session.set('id', id);
        Session.set('mode', 'view');
      }
    });
    var router = new Router;
    router.on('route:main', function () {
      var userid = Indicators.insert({date: new Date()});
      router.navigate('/' + userid + '/edit');
      Session.set('id', userid);
    });
    Backbone.history.start({pushState: true});
  });


  Template.body.tstrings = ["Concerning statements",
                  "Behavioral cues",
                  "Events/Situational cues",
                  "Feelings"];
  Template.body.lstrings = [
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
        "Purposelessness"]];
  Template.body.helpers({
    title: function () { return _.range(Template.body.tstrings.length); },
    tstring: function (t) { return Template.body.tstrings[t]; },
    item: function (t) { return _.range(Template.body.lstrings[t].length); },
    lstring: function (t, l) { return Template.body.lstrings[t][l]; },
    selected: function (t, l) {
      var concat = t + '_' + l;
      var param = {};
      param[concat] = true;
      param['_id'] = Session.get('id');
      if (Indicators.findOne(param))
        return "class=selected";
      return '';
    }
  });
  Template.body.events({
    'click': function (e) {
      if (Session.get('mode') != 'edit')
        return;
      var elem = e.toElement;
      var clicked = e.toElement.dataset;
      if (Object.keys(clicked).length !== 0) { // clicked is non-empty - should be a <li>
        var concat = clicked.title + '_' + clicked.item;
        var param = {};
        param[concat] = true;
        if (elem.classList.contains('selected'))
          Indicators.update(Session.get('id'), {$unset: param});
        else
          Indicators.update(Session.get('id'), {$set: param});
      }
    }
  });
}

