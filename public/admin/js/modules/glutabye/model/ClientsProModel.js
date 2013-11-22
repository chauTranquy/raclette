Ext.define('TextoCMS.Modules.glutabye.model.ClientsProModel', {
	extend : 'Ext.data.Model',
	idProperty : 'id_client',
	fields : [ {
		name : 'id_client',
		type : 'int'
	}, 'nom', 'prenom', {
		name : 'civilite',
		type : 'int'
	}, 'siret', 'adresse', 'adresse2', 'adresse3', {
		name : 'raison_sociale',
		convert : function(v) {
			return v.trim();
		}
	}, 'cp', 'ville', {
		name : 'type',
		type : 'int'
	}, {
		name : 'id_groupe',
		type : 'int'
	}, 'description', 'email', {name:'tel', convert:function(v){
		return v.replace(/\s/g, '');
		
	}}, {
		name : 'num_client',
		type : 'int'
	}, 'password', {
		name : 'statut',
		type : 'int'
	}, {
		name : 'groupName'
	},

	{
		name : 'libelleType'
	},
	{
		name : 'sendMail',
		type:'int'
	}],
	proxy : {
		type : 'texto',
		extraParams : {
			API : 'Cmsmodules_Model_ClientsProMapper',
			APICall : 'fetchAllClient'/*,
			where : 'id_site=' + TextoCMS.siteId
			*/

		}
	}

});