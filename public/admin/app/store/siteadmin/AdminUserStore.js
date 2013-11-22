Ext.define('TextoCMS.store.siteadmin.AdminUserStore',{
	extend:'Ext.data.TreeStore',
	requires:['TextoCMS.model.siteadmin.AdminUserModel'],
	model:'TextoCMS.model.siteadmin.AdminUserModel',
	//autoLoad:true,
    sorters: [
              {
                  property : 'superadmin',
                  direction: 'DESC'
              },
              {
                  property : 'group_name',
                  direction: 'ASC',
                  transform:function(value){
                	  return value.toLowerCase();
                	  
                  }
              },
              {
                  property : 'firstname',
                  direction: 'ASC',
                  transform:function(value){
                	  return value.toLowerCase();
                	  
                  }
              }
          ]
});