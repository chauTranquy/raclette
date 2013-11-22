Ext.define('TextoCMS.components.cms.Loader',{
	extend:'Ext.Base',
	requires:['TextoCMS.components.cms.fields.ContentBrowser',
	          'TextoCMS.components.cms.fields.Fields',
	          'TextoCMS.components.cms.fields.File',
	          'TextoCMS.components.cms.fields.ItemsMenu',
	          'TextoCMS.components.cms.fields.RichText',
	          'TextoCMS.components.cms.fields.Text',
	          'TextoCMS.components.cms.ArboEdit',
	          'TextoCMS.components.cms.BrowserTree',
	          'TextoCMS.components.cms.ContentBrowserTree',
	          'TextoCMS.components.cms.IconBrowser',
	          'TextoCMS.components.cms.TreeMenu',
	          'TextoCMS.components.cms.fields.Checkbox',
	          'TextoCMS.components.cms.fields.Textarea',
	          'TextoCMS.components.cms.fields.Datefield',
	          'TextoCMS.components.cms.fields.Combo',
	          'TextoCMS.components.cms.fields.Itemselect',
	          'TextoCMS.components.cms.fields.Multiselect'
	         
	          ],
	          constructor:function(){
	        	
	        	  this.callParent(arguments);
	        	  
	        	  
	          }
	
});