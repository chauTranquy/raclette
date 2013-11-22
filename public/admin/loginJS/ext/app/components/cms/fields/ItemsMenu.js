/**
 * 
 */

Ext.define('CMS.components.cms.fields.ItemsMenu' ,{
	extend:'Ext.panel.Panel',
	 uses: ['Ext.data.Store','Ext.grid.Panel'],
	 alias : 'widget.itemsmenu',
	 layout:'column',
	 value:null,
	 rights:{
		 write:1
		 
	 },
	 autoExpand:null,
	 data:[],
	 showLabel:true,
	 bodyStyle:"margin-bottom:10px",
	border:false,
	 defaults:{
		 border:false,
		 autoHeight:true
		 
	 },
	 autoHeight:true,
	 initComponent:function(){
		var me=this;
		
		if(this.value!=null)this.data=Ext.JSON.decode(this.value);
		
		
		this.textField=Ext.create('Ext.form.field.Text',{
			hidden:true,
			name:this.name,
			allowBlank:this.allowBlank,
			value:this.value
			
		});
		
		 this.width=this.width||750;
		  gridWidth = this.showLabel ? this.width-150:this.width;
		  
		this.actionCol=Ext.create('Ext.grid.column.Action',{
            xtype:'actioncolumn', 
            menuDisabled :true, 
            sortable:false,
            width:50,
            bodyStyle:'cursor:pointer',
            align:'center',
            items: [{
                icon: 'img/icons/pencil.png',  // Use a URL in the icon config
                tooltip: 'Editer l\'&eacute;l&eacute;ment',
                scope:this,
               
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    this.openForm(rec);
                }
            }]});
		
		
		if(this.extraParams.maxItems){
			var height=this.extraParams.maxItems*30;
			if(height>350) height=350;
			
			
		}else height=250;
		
		
	    this.sm = Ext.create('Ext.selection.CheckboxModel',{
	    	
	    		checkOnly:true,
	            listeners: {
	            	scope:this,
	                selectionchange: function(sm, selections) {
	                	if(this.rights.write==0)return;
	                	
	                	this.deleteBtn.setDisabled(selections.length==0);
	                	
	                },
	                select:function(sm){
	                	if(this.rights.write==0)return;
	                	this.deleteBtn.setDisabled(sm.getSelection().length==0);
	                	},
	                	deselect:function(sm){
	                		if(this.rights.write==0)return;
		                	this.deleteBtn.setDisabled(sm.getSelection().length==0);
		                	
		                	
		                }
	            }
	    	
	    });

	    
this.cols=[];
this.editors=[]
this.storeFields=[];

this.showCol=0;

Ext.Array.filter(this.extraParams.fields, function(obj){
	if(obj.showCol==1)this.showCol++;
}, this);

this.showColLength = (gridWidth-110)/this.showCol;

		this.extraParams.fields.each(function(elt){
			
			var extra_params=(elt.extraParams?elt.extraParams:{});
			this.storeFields.push({name:elt.name});
			if(elt.showCol==true)this.cols.push({header:elt.label,  height:40,width:elt.showCol?this.showColLength:20, hidden:elt.showCol!=true, style:elt.showCol!=true?"display:none":"", dataIndex:elt.name , menuDisabled :true, sortable:false})
			
			if(elt.field_type!="combo") var field={xtype:elt.field_type,name:elt.name, allowBlank:elt.compulsary==0, fieldLabel:elt.label, extraParams:extra_params, rights:this.rights};
    		
    		else{
    			
    			var dataStore = extra_params ;
    			
    			var cbStore = Ext.create('Ext.data.Store', {
    			    fields: ['value', 'label'],
    			    data : dataStore
    			});
    			
    		
    			var field={xtype:elt.field_type.toLowerCase(),rights:this.rights,fieldLabel:elt.label, allowBlank:elt.compulsary==0,name:elt.name, store:cbStore, queryMode: 'local',
    				    displayField: 'label',
    				    valueField: 'value',rights:this.rights};
    		}
			
			if(elt.field_type=="checkbox")field.inputValue=1;
			
			this.editors.push(field);//{xtype:elt.type,name:elt.name, allowBlank:elt.compulsary==0, fieldLabel:elt.label, extraParams:extra_params, rights:this.rights}
			
		},this);
	    
	this.cols.push({dataIndex:'statut', header:'Statut',renderer:function(v){
		
			if(v==1) return '<img src="img/icons/accept.png" data-qtip="En ligne" />';
			return '<img src="img/icons/stop.png" data-qtip="Hors ligne" />';
			}
			, width:40, align:'center',menuDisabled :true, sortable:false},this.actionCol);
	
	this.storeFields.push({name:'statut', type:'int'});
	this.editors.push({xtype:'checkbox',name:'statut', fieldLabel:'Statut', inputValue:1});
	
	this.modelName='Item_'+this.name;
	
	this.model=Ext.define(this.modelName, {
	    extend: 'Ext.data.Model',
	    fields: this.storeFields
	});
	
	
	this.store=Ext.create('Ext.data.Store', {
		    model:this.modelName,
		    data:this.data,
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json'
		        }
		    },
		    listeners:{
		    	scope:this,
		    
		    datachanged:function(store){
		    	var textvalue=[];
		    	
		    	
		    	
		    	store.data.each(function(elt){
		    		
		    		
		    		textvalue.push(Ext.JSON.encode(elt.data));	
		    	}, this);
		    	
		    	
		    	this.textField.setValue('['+textvalue.join(',')+']');
		    	this.textField.fireEvent("dirtychange",this.textField.isDirty());
		    }	
		    }
		});
	
	    this.deleteBtn=Ext.create('Ext.button.Button',
	    	{text:'Supprimer',tooltip:'Supprimer la s&eacute;lection', scope:this, handler:this.deleteItem, disabled:true,iconCls:'removeBtn'}
	    	
	    );
	    
	    
	    if(this.rights.write==1) viewConf={
	            plugins: {
	                ptype: 'gridviewdragdrop'
	            },
				multiselect:true
				
			};
	    else viewConf={};
	 
	   
	    
		this.gridPanel=Ext.create('Ext.grid.Panel',
				{bodyPadding:5,border:true, collapsible:false, width:gridWidth, margin:'0 5 10 5',
				store:this.store,
				selModel:this.sm,
				height:height,
				layout:'fit',
				viewConfig: viewConf,
				
				columns:this.cols
				         ,
			tbar:[{text:'ajouter',tooltip:'Ajouter un &eacute;l&eacute;ment',iconCls:'addBtn', scope:this, disabled:this.rights.write==0, handler:function(){this.openForm(null);}}, this.deleteBtn]
		});
				
		
		this.items=[];
		if(this.showLabel)this.items.push({width:150,autoHeight:true,hidden:this.showLabel==false,items:[{xtype:'panel', html:this.fieldLabel+' :', width:150, style:'text-align:right', border:false}]});
	    
		this.items.push({width:gridWidth,autoHeight:true,items:[this.textField,this.gridPanel]});
		
		this.callParent(arguments);
		
	},
	openForm:function(record){
		
		
	
		if(record==undefined)record=null;
		fields=[];
		
		this.editors.each(function(editor){
			
			if(editor.xtype!='checkbox')editor.value=(record!=null?record.get(editor.name):null);
			else editor.checked=record?record.get(editor.name)==1:false;
			
			
			fields.push(editor);
		}, this)
		
		this.form = Ext.create('Ext.form.Panel',{
			border:false,
			trackResetOnLoad:true,
			//width:510,
			
			bodyStyle:'padding:5px',
			defaults:{
				labelStyle:"text-align:right",
				labelWidth:100,
				width:350,
				
				bodyStyle:'background-color:transparent',
				border:false
			},
			items:[fields],
			listeners:{
				scope:this,
				validitychange:function(form,isValid){
					if(this.rights.write==0)return;
					this.win.query('button[action=save]')[0].setDisabled(!isValid);
				},
				dirtychange:function(form,isDirty){
					if(this.rights.write==0)return;
					if(isDirty&&form.isValid())return this.win.query('button[action=save]')[0].setDisabled(false);
					
				}
				
			}
			
		}); 
		
		this.win=Ext.create('Ext.window.Window',{
			modal:true,
			bodyStyle:'background-color:transparent',
			title:(record?'&Eacute;dition d\'un':'Nouvel')+' &eacute;l&eacute;ment',
			autoWidth:true,
			padding:5,
			items:[this.form],
			buttons:[{text:'Enregistrer', iconCls:'saveBtn', action:'save', scope:this, handler:this.saveItem.bind(this,record), disabled:true},{text:'Fermer', scope:this, handler:function(){this.win.close();}}]
			
		});
		this.win.show();
		
		
	},
	saveItem:function(record){
		if(this.rights.write==0)return;
		var values= this.form.getValues();
	
		
		if(record){
			record.beginEdit();
			this.storeFields.each(function(elt) {
				record.set(elt.name,values[elt.name]);
				
			},this);
			
			record.endEdit();
			record.commit();
			this.store.fireEvent('datachanged', this.store);
		}
		else{
			
			var item={};
			
			this.storeFields.each(function(elt) {

				item[elt.name]=values[elt.name];
				
			},this);
			


var record=Ext.ModelManager.create(item, this.modelName);

	
		this.store.add(record);
	
		
	
		
		}
		
		this.win.close();
		
		
		
	},
	deleteItem:function(){
		if(this.rights.write==0)return;
		var selection = this.sm.getSelection();
		
		Ext.Msg.show({
		     title:'Suppression '+(selection.length<2?'d\'un &eacute;l&eacute;ment':'de plusieurs &eacute;l&eacute;ments'),
		     msg: 'Attention, la suppression est d&eacute;finitive !<br />Voulez-vous continuer ?',
		     buttons: Ext.Msg.YESNO,
		     icon: Ext.Msg.WARNING,
		     scope:this,
		     fn:function(btn){
		    	 if(btn=='no') return;
		    	 
		    	 selection.each(function(elt){
		    		this.store.remove(elt); 
		    	 }, this);
		    	 
		    	 
		     }
		     
		});
		
		
	}
	
});