Indicators = new Meteor.Collection("indicators");

if (Meteor.isClient) {
  var tstrings = ["Concerning statements",
                  "Behavioral cues",
                  "Events/Situational cues",
                  "Feelings"];
  lstrings = [
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
  Template.hello.helpers({
    title: function () { return _.range(tstrings.length); },
    tstring: function (t) { return tstrings[t]; },
    listitem: function (t) { return _.range(lstrings[t].length); },
    lstring: function (t, l) { return lstrings[t][l]; }
  });
}
