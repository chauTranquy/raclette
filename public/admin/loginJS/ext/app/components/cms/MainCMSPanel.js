Ext.define('CMS.components.cms.MainCMSPanel' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.maincmspanel',
   
    initComponent: function() {
    	var me = this;
    	
    	Ext.apply(me,{
    		tbar:[{xtype:'label',html:"&nbsp;", id:'breadCrumb'}],
    		items:[{xtype:'panel',
    			tbar:[],
    		id:'centerPanel',
    		border:false}]
    		
    		
    	});
        	
        this.callParent(arguments);
        
        
    }
});