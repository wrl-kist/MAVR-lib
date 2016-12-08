MAVR.SceneGraphView = function () {
	var scenegraph;
	var scenegraphID;
	var scenegraphPrefix;
	var sceneThing;
	var that = this;
	
	this.init = function(nodeID, prefix) {		
		scenegraphID = nodeID;
		scenegraphPrefix = prefix;
			
		var ele = $('<div/>', {id: scenegraphID});
		ele.appendTo('body');
		
		$("#"+scenegraphID).jstree(
			{ core: { check_callback : true },				
				plugins : [ "checkbox", "changed" ],
				"checkbox" : { "three_state" : false, "tie_selection" : false, "whole_node" : false }
			}
		);
		
		scenegraph = $("#"+scenegraphID).jstree();
		$("#"+scenegraphID).draggable();
		$("#"+scenegraphID).resizable();
		
		$("#"+scenegraphID).on("check_node.jstree", function (e, data) {
			MAVR.SceneGraph.changeAnnotationObjects(data.node.id, true); 
		});
		
		$("#"+scenegraphID).on("uncheck_node.jstree", function (e, data) {
			 MAVR.SceneGraph.changeAnnotationObjects(data.node.id, false); 
		});
		
		// add scene node
		sceneThing = MAVR.Things.generateUUID();
		MAVR.Things.setThing(sceneThing, { id: sceneThing, origin:"Scene", type: "Scene", name: "Scene", draw: false });
		MAVR.SceneGraph.createSceneNode(null, MAVR.Things.getThing(sceneThing));
	}

	this.getSceneGraph = function() {
		return scenegraph;
	}
	
	this.createNode = function(parentNode, param) {
		var node = scenegraph.create_node(parentNode, param);
		
		this.expandAll();
		
		return node;
	}
	
	this.getNode = function(nodeID) {	
		return scenegraph.get_node(scenegraphPrefix + nodeID);
	}
	
	this.selectNode = function(nodeID) {
		$("#"+scenegraphID).jstree("check_node", "#" + nodeID); 
	}
	
	this.deselectNode = function(nodeID) {
		$("#"+scenegraphID).jstree("uncheck_node", "#" + nodeID); 
	}
	
	this.show = function() {
		$("#"+scenegraphID).show();
	}
	
	this.hide = function() {
		$("#"+scenegraphID).hide();
	}
	
	this.expandAll = function() {
		$("#"+scenegraphID).jstree().check_all();
		$("#"+scenegraphID).jstree('open_all');
	}
	
	this.traverseAll = function(callback) {
		var rootNode = this.getNode(sceneThing);
		
		this.traverse(rootNode, callback);
	}
	
	this.traverse = function(rootNode, callback) {
		for (var i = 0 ; i < rootNode.children.length; i++) {
			var childNode = this.getNode(rootNode.children[i].substring(scenegraphPrefix.length));
			
			if(childNode.children.length > 0) {
				callback(childNode);
				this.traverse(childNode, callback);
			} else {
				callback(childNode);
			}
		}
	}
};
