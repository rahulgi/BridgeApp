function Network(){
//Data-
var node = null;
var x = 20;
var y = 20;
var radius = 300;
var nodesG = d3.selectAll("g");
var linksG = null;
var linkedByIndex = {};

var force = d3.layout.force();

	var width = 4000;
	var height = 2000;
var network = function(selection,data){
	setupData(data);
	var test = d3.select(selection);

	var vis = d3.select(selection).append("svg").attr("width",width).attr("height",height);
	nodesG = vis.append("g").attr("id","nodes");
	linksG = vis.append("g").attr("id","links")
	//force.size([width,height]);;
	force.size([width,height]);
	force.on("tick", forceTick).charge(-70000).linkDistance(50);
	update();
}

var mapNodes = function(nodes){
	nodesMap = d3.map();
	var len = nodes.length;
	nodesMap.set(nodes[0].concerningStatements.id,nodes[0].concerningStatements);
	nodesMap.set(nodes[1].behaviouralCues.id,nodes[1].behaviouralCues);
	nodesMap.set(nodes[2].eventCues.id,nodes[2].eventCues);
	nodesMap.set(nodes[3].feelings.id,nodes[3].feelings);
	var stmts = nodes[0].concerningStatements.statements;
	var len = stmts.length;
	for(var i = 0; i < len ; i++){
		nodesMap.set("1a",stmts[i]);
	}
	stmts = nodes[1].behaviouralCues.statements;
	var len = stmts.length;
	for(var i = 0; i < len ; i++){
		nodesMap.set("2a",stmts[i]);
	}
	return nodesMap;

}

var setupData = function(data){

	var len = data.nodes.length;
	setNodes(data);

	var nodesMap = mapNodes(data.nodes);
	data.links.forEach(function(l){


		l.source = nodesMap.get(l.source);

		l.target = nodesMap.get(l.target);
		linkedByIndex["#{l.source.id},#{l.target.id}"] = 1

	});
	return data;

}

network.toggleLayout = function(newLayout){



}
var clickedElemGlobal = null;

var updateNodes = function(nodes){
	console.log("UPDATE CALLED");
	 node = nodesG.selectAll("circle.nodes").data(nodes,function(d){
		return d.id;
	});
	 var clickedId = 0; 
	 var clickedElem = null;
	node.enter().append("circle").attr("class","nodes")
	.attr("cx",function(d){

		return d.x;
	})
	.attr("cy",function(d){
		return d.y;
	})
	.attr("r",function(d){
		console.log("MOTHER FUCKING RADIUS");
		console.log(d.radius);
		return d.radius;
	})
	.style("fill","#5882FA")
	.style("stroke","black")
	.style("stroke-width",2.0)
	.on("click",function(d,i){
		clickedId = d.id; 
		clickedElem = d;
		clickedElemGlobal = clickedElem;
		console.log("clickedElemGlobal");
		console.log(clickedElemGlobal);
		var otherNodes = nodesG.selectAll("circle.nodes");
		otherNodes.transition().attr("cx",function(current){
			return clickedElem.x;
		}).duration(1000).each("end",populateSubNodes(nodes,clickedElem,d3.select(this))).
		attr("r",function(c){
			console.log("RADIUS IS BEING SET AGAIN WHY");
			return 40;
		}).transition().duration(1000);
		//no remove because API suggests not to. 
		;

	});

	var textNodes = nodesG.selectAll("text").data(nodeTextArray,function(d){
		return d;
	});
	//textNodes.enter().append("text").attr("x",function(d,i){return nodes[i].x}).attr("dy",".35em");


	node.attr("cx",function(d){
		return d.x;

	}).transition().duration(1000)
	.attr("cy",function(d){
		d.y
	}).attr("r",function(d){
		return radius;
	});





	node.exit().remove();	



}

var nodeTextArray = ["Concerning Statements", "Behavioural Cues", "Event Cues", "Feelings"];

var getStatements = function(key){
	if(key == "concerningStatements"){
		return data.nodes[0].concerningStatements.statements;
	} else if (key == "behaviouralCues"){
		return data.nodes[1].behaviouralCues.statements;
	} else if (key == "eventCues"){
		return data.nodes[2].eventCues.statements;
	} else if (key == "feelings"){
		return data.nodes[3].feelings.statements;
	}
}
$(document).click(function(e){
	var bool = $(e.target).is("#nodes");

		var subNodes = nodesG.selectAll("circle.subNodes");
		var superNodes = nodesG.selectAll("circle.nodes");
		subNodes.transition().duration(2000).attr("cx",function(d){
			if(clickedElemGlobal != null){
			return clickedElemGlobal.x;
		}}).attr("cy",function(d){
			if(clickedElemGlobal != null)
				return clickedElemGlobal.y;

		}).remove();
		clickedElemGlobal = null;


		//subNodes.remove().transition().duration(1000);
		update();



});

$(document).on("click","#nodes",function(e){
	e.stopPropagation();

});

var populateSubNodes = function(nodes,clicked,clickedD3Obj){
	var len = nodes.length;
	var nodeName = Object.keys(clicked)[0];
	for(var i = 0; i < len;i++){
		if(nodes[i].id == clicked.id){
			var testNode = nodes[i];
			var subNodeInfo = getStatements(nodeName);
			var subNodeId = nodes[i].subId;
			var newSubNodeArray = [];
			var totalSubNodes = subNodeInfo.length;
			var anglePerSubNode = 360/totalSubNodes;

			var radiusBetweenSubNodeAndNode = 400;

			for(var j = 1; j <= totalSubNodes;j++){
				var statementText = subNodeInfo[j-1];
				subNodeId = j-1;
				var newSubNode = {"info" : statementText, "id" : subNodeId};
				var cosAngle = Math.cos((2*Math.PI*j)/totalSubNodes);
				var sinAngle = Math.sin((2*Math.PI*j)/totalSubNodes);
				newSubNode.x = (radiusBetweenSubNodeAndNode * cosAngle )+ clicked.x;
				newSubNode.y = (radiusBetweenSubNodeAndNode * sinAngle) + clicked.y;
				newSubNodeArray.push(newSubNode);
			}

			var subNodes = nodesG.selectAll("circle.subNodes").data(newSubNodeArray);
			window.setTimeout(dummyFunc(subNodes),2000);
	
	
		}
	}
}
var curNodesData = null;
var curLinksData = null;

var dummyFunc = function(subNodes){
			template_helpers.selected(clickedElemGlobal.id)
			subNodes.enter().append("circle").attr("class","subNodes").attr("cx",function(d){
				return d.x;
			}).attr("cy",function(d){

				return d.y;
			}).attr("r", 200).on("click",function(d,i){
				clickedElemGlobal.id;
				console.log("INSIDE SUB NODE CLICK");
				console.log(d.id);
				handleIndicatorClick(clickedElemGlobal.id,d.id);
			}).transition().duration(2000);

			Meteor.autorun(function(d){
				if(template_helpers.selected(clickedElemGlobal.id,d.id)){
					subNodes.attr("fill","green");
			} else {
				subNodes.attr("fill","red");
			}


			});


}

var updateLinks = function(curLinksData){
	link = linksG.selectAll("line.link").data(curLinksData,function(d){
		return "#{d.source.id}_#{d.target.id}"

	})
	link.enter().append("line")
	.attr("class","link")
	.attr("stroke","#ddd")
	.attr("stroke-opacity",0.8)
	.attr("x1",function(d){
		console.log("WHAT IS D");
		console.log(d);
		return d.source.x;
	})
	.attr("y1",function(d){
		return d.source.y;
	})
	.attr("x2",function(d){
		return d.target.x;
	})
	.attr("y2",function(d){
		return d.target.y;
	});
	link.exit().remove();
}

//force.on("tick",forceTick).charge(-200).linkDistance(50);


var forceTick = function(e){
	node.attr("cx",function(d){

		return d.x;
	})
	.attr("cy",function(d){
			return d.y;
	});


}
var nodeInfoFunction = function(node){
	node.x = Math.floor(Math.random()*width);
	node.y = Math.floor(Math.random()*height);
	node.radius = radius;
}

var setNodes = function (data){
	var nodes = data.nodes;
	nodes[0].x = 0;
	nodes[0].y = 10;
	nodes[0].radius = radius;
	nodes[0].id = nodes[0].concerningStatements.id;
	nodes[0].text = "concerningStatements";
	var stmts = nodes[0].concerningStatements.statements;
	var len = stmts.length;
	for(var i = 0; i < len;i++){
		nodeInfoFunction(stmts[i]);
	}


	nodes[1].x = 1000;
	nodes[1].y = 10;
	nodes[1].radius = radius;
	nodes[1].id = nodes[1].behaviouralCues.id;
	nodes[1].text = "behaviouralCues";
	stmts = nodes[1].behaviouralCues.statements;
	len = stmts.length;
	for(var i = 0; i < len; i++){
		nodeInfoFunction(stmts[i]);
	}


	nodes[2]. x = 2000;
	nodes[2].y = 10;
	nodes[2].radius = radius;
	nodes[2].id = nodes[2].eventCues.id;
	nodes[2].text = "eventCues";
	stmts = nodes[2].eventCues.statements;
	len = stmts.length;
	for(var i = 0; i < len;i++){
		nodeInfoFunction(stmts[i]);
	}

	nodes[3].x = 3000;
	nodes[3].y = 10;
	nodes[3].radius = radius;
	nodes[3].id = nodes[3].feelings.id;
	nodes[3].text = "feelings";
	stmts = nodes[3].feelings.statements;
	len = stmts.length;
	for(var i = 0; i < len;i++){
		nodeInfoFunction(stmts[i]);
	}


}

var update = function(){

	force.nodes(data.nodes);
	updateNodes(data.nodes);

	force.links(data.links);
	updateLinks(data.links);


	force.start();



}
	return network;

}





var data = {
	"nodes" : [
		{"concerningStatements" :{
			"statements" : ["Talking about suicide", "Wish I were dead", "Going to end it all",  "Won't be around much longer", "Can't go on", "Soon they won't have to worry about me"],
			"subId" : "1a",
			"id" : "1",

		}},
		{"behaviouralCues" : {
			"statements" : ["Has or looking for lethal means to kill oneself", "Social withdrawal","Substance abuse", "Not sleeping","Recklessness","Putting affairs in order", "Rejecting help"],
			"subId" : "2a",
			"id" : "2",
		}},
		{"eventCues" : {
			"statements" : ["Loss of someone close", "Loss of academic opportunities","Fear of negatiev consequences","Depression"],
			"id" : "3",
			"subId" : "3a"
		}},
		{"feelings" : {
			"statements" : ["Loss of someone close","Loss of academic opportunities","Fear of negatiev consequences","Depression"],
			"id" : "4",
			"subId" : "4a"
		}}

	],
	"links" : [
		{
			"source" : "1",
			"target" : "1a"
		},
		{
			"source" : "2",
			"target" : "2a"
		}

	]

}


if (Meteor.isClient) {
	Meteor.startup(function() {
		var myNetwork = Network();
		myNetwork("#visualization",data);
	});
}