Ext.define('TextoCMS.store.siteadmin.RightsStore',{extend:'Ext.data.TreeStore',requires:['TextoCMS.model.siteadmin.RightsModel'],id:'rightsStore',autoDestroy:true,model:'TextoCMS.model.siteadmin.RightsModel',autoLoad:true,proxy:{type:'memory',reader:{type:'json'}}});