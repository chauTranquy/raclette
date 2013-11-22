Ext.define('TextoCMS.view.siteadmin.userAdminViews.GridRights',{
		alias:'widget.gridrights',
		requires:['Ext.ux.CheckColumn'],
		extend:'Ext.tree.Panel', 
        rootVisible: false,
        columns: [
            {
	            xtype: 'treecolumn', //this is so we know which column will show the tree
	            text: '<div style="text-align:center">Nom</div>',
	           sortable: false,
	           draggable:false,
	           menuDisabled:true,
	           dataIndex: 'text',
	           width:250,
	           fixed: true
	        }
            ,
            {
                xtype: 'checkcolumn',
                header: 'Voir',
                draggable:false,
 	           menuDisabled:true,
                align:'center',
                fixed:true,
               dataIndex:'read',
                width: 55,
                renderer:function(value, meta,record){
                	
                	//if(record.get('type')=='tree') return;
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];

                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                }
            } ,
            {
                xtype: 'checkcolumn',
                header: 'Modifier',
                draggable:false,
 	           menuDisabled:true,
                align:'center',
                fixed:true,
               dataIndex:'write',
                width: 55,
                renderer:function(value, meta,record){
                	
                	//if(record.get('type')=='tree') return;
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];

                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                }
            },
            {
                xtype: 'checkcolumn',
                header: 'Cr&eacute;er/Supprimer',
                align:'center',
                draggable:false,
 	           menuDisabled:true,
 	           fixed:true,
               dataIndex:'edit',
                width: 150,
                renderer:function(value, meta,record){
                	var cssPrefix = Ext.baseCSSPrefix,
                    cls = [cssPrefix + 'grid-checkheader'];
                if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
                	
                }
            }
        ],
        buttons:[{text:'Sauvegarder', action:'submit'}, {text:'Fermer', action:'close'}],
        width: 600,
        height:700,
        initComponent:function(){
        	this.callParent(arguments);
        	
        }
	
	
	
});