Ext.define('TextoCMS.view.cms.ContentPanel',{
	extend:'Ext.panel.Panel',
	layout:'fit',
	alias:'widget.contentpanel',
	border:false,
	//uses:['TextoCMS.components.cms.Loader'],
	tooltip:'Modifier le contenu',
	autoDestroy:true,
	 defaults : {
       split : true
     },
	items:[
	       {region:'center', xtype:"tabpanel",  plain: true,
	    	   style:'background:transparent',
	    	   layout:'fit',
	    	  //flex:1,
	    	   items:[] }
	     //  
	       ],
	       
	       initComponent:function(){
	    	   this.callParent(arguments);
	    	delete this.data.success;
	    	this.rights=this.data.rights;
 	    	var contentForm = {xtype:'contentform', data:this.data};
	    	
	    	var panel= this.query('panel[region=center]')[0];
	    	panel.add(contentForm);
	    	panel.add({xtype:'versiontab', id_rubrique:this.data.result.id_rubrique, version_id:this.data.result.version_id});
	    //	panel.doLayout();
	   	    this.initContentInfo();
	   	
	    	   
	       },
	       
	       initContentInfo:function(){
    	   var result = this.data.result;
	    		    	   var data ={
	    	              "Statut":Number(result.inline_version)>0?"En ligne":"Hors ligne",
	    	              'Version':result.version_id,
	    	              'Cr&eacute;&eacute; le':TextoCMS.Utils.formatDate(result.creation_date)
	    	   };
	    	   
	    	if(result.inline_version!=result.version_id)data["Version en ligne"] = result.inline_version;
	    		    	   
	    	   if(result.update_date!==null)data['Modifi&eacute; le']=TextoCMS.Utils.formatDate(result.update_date);
	    	   data['Par']=result.userName;
	    	   if(result.status=="1")data['Publi&eacute; le']=TextoCMS.Utils.formatDate(result.publication_date);
	    	   data['Template']= result.templateRef;
	    	   var infoGrid={xtype:'infogrid', frame:true, source:data, layout:'fit', id:'infoPanel'};
	    	   var panel= this.query('#infosPanel')[0];
	    	   rightsHTML = (this.rights.write==0?'Vous n\'avez pas l\'autorisation de ':'Vous pouvez ')+'modifier cet article<br />';
	    	   rightsHTML += (this.rights.edit==0?'Vous n\'avez pas l\'autorisation de ':'Vous pouvez ')+ 'publier ou d&eacute;publier cet article, cr&eacute;er des &eacute;l&eacute;ments';
	    	   
	    	   var panelRights={xtype:'panel', frame:true, html:'<strong>Vos droits</strong><br />'+rightsHTML, layout:'fit', margin:'10px auto'};
	    	   
		    	 panel.add(infoGrid,panelRights);
		    	 
		    	 
	    	
	    	   
	       },
	     
	       onRemove:function(){
	    	   //console.log('je suis removed');
	    	   
	       }
	
	
});