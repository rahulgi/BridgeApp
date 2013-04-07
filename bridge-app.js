Indicators = new Meteor.Collection("indicators");

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
      },
      main: function () {
        Session.set('mode', 'main');
      }
    });
    var router = new Router;
    Backbone.history.start({pushState: true});
    if (Session.get('mode') == 'main') {
      var userid = Indicators.insert({});
      router.navigate('/' + userid + '/edit');
    }
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
