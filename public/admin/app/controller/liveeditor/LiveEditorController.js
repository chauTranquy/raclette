var ouvert=false;

var contenu;
Ext.define('TextoCMS.controller.liveeditor.LiveEditorController', {
	extend : 'TextoCMS.controller.BaseController',
	views : [ 'TextoCMS.view.liveeditor.Palette' ],
	refs : [ {
		ref : 'palette',
		selector : 'palette'
	}

	],
	require :[
	             'Ext.Editor',
	             'Ext.form.Panel'
	        
	         ],

	init : function() {

		this.control({
			'#Contenu' : {
				click : this.contenuClick

			},
			'palette' : {
				collapse : this.closeWindow

			},
			'#ferme' : {
				click : this.fermeClick

			}

		});

		Ext.widget('palette').show();

	},
	/**
	 * lance la requête ajax de récupération des infos de la page
	 * @param btn 
	 */
	fermeClick:function(btn){
		ouvert=false;
		
		
			
		
	},
	
	contenuClick : function(btn) {

		this.ajax(DEFAULT_ADMIN_URL, {
			API : 'Application_Model_ContentMapper',
			APICall : 'getContent',
			id_rub:id_rubrique
		}, Ext.bind(this.createPageModel, this), false);

	},
	closeWindow : function() {
		alert('ferme');
	
	},
	/**
	 * 
	 * @param response
	 */
	createPageModel : function(response) {

		var json = response;
		//var tmp = Ext.JSON.decode(json.data);
		//contenu = tmp.content;
		//console.log(contenu);
		
		this.ajax(DEFAULT_ADMIN_URL, {
			API : 'Application_Model_ContentMapper',
			APICall: 'getContentData',	       
   	        id_element:id_rubrique,
   	        templateRef:json.templateRef
		},Ext.bind(this.initPageEditor, this),false);
		
	},
	
	initPageEditor : function(response) {
		
		
		// var json = Ext.JSON.encode(response);
	//	 var tmp = Ext.JSON.decode(json.data);
		contenu=response.result.data;
	// console.log(response);
		
	var fields = response.fields;
		
		
   	 if(!response.result){
 		alert("pas de contenu");
 		 return;
 	 }
 	 
 	 this.data = Ext.JSON.decode(response.result.data);
 	
 	 console.log(this.data);
 	 
 //	console.log("-------------------------"+response);
 	fields.each(function(field){
 			var name =field.field_name;
 		var value = this.data[name];
 		console.log(value);
  		 
 	 }, this);
		
	},
	
	openEditor:function(e, fieldtitle, type){

		Event.stop(e);
		if(ouvert) return;
		ouvert = true;
					
		var elt = $$('.'+fieldtitle)[0];
		console.log("e :"+e.type);
		console.log("type :"+type.toLowerCase());
		console.log("elt :"+elt);
		console.log("stop");
		
		
//		return;
		
		
		/* vide le contenu de l'element */
		
		elt.update('');
		
		
		
		/*  Pour un champs text 
		 *  Crer un champ text avec value par default l'ancienne valeur
		 *
		 **/
		
		
			var tf = Ext.widget(type.toLowerCase(),{
				renderTo:elt,
				name:fieldtitle,
				fieldLabel:'tot',
				value:this.data[fieldtitle]
				
				
			});
		
		switch(type.toLowerCase()){
			
			
			case "text":
				
				tf.on('blur',Ext.bind(function(e,t){
					
					
				
					elt.update(tf.getValue());
					
					if(tf.isDirty()){
									
						var eltClass = elt.className;
						var contenuT = tf.getValue();
						
						var num=Ext.ComponentQuery.query('text');
						
						console.log(num);
						tf.destroy();
						//ouvert=false;
						ouvert=false;
						
						
					/*
					 	console.log(this);
					 	console.log("this.ajax : "+ this.ajax);
					 	
					 	
					 	this.ajax(DEFAULT_ADMIN_URL, {
							API : 'Application_Model_ContentMapper',
							APICall: 'addOrModify',	       
							 actionType: 1,
				    	       id_element:id_rubrique,
				    	       content: contenu,
				    	       title : contenuT	     
						},Ext.bind(this.textModif, this),false);
						}
						
					 	*/
					 	
					} 	
					 	
					
				}, this));
				break;
				
			case "richtext":
			//	tf.doLayout();
			case "chapeau" :
				//tf.doLayout();
				tf.on('dirtychange',Ext.bind(function(e,t){
					
				alert("des modif ont eu lieu");
					 	elt.update(tf.value);
					
				}, this));
				
				console.log(tf);
				
				break;
		}

		
		console.log("stop");
	  
	},
	
	textModif:function(response){
		console.log(response);
		console.log("textModif");
		
	}
		
});