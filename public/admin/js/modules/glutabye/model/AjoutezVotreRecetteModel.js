Ext.define('TextoCMS.Modules.glutabye.model.AjoutezVotreRecetteModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id_ajoutRecette',
    fields: [
        {name: 'id_ajoutRecette', type: 'int'},
        {name: 'recetteNomPersonne', type: 'string'},
        {name: 'recettePrenomPersonne', type: 'string'},
        {name: 'email', type: 'email'},
        {name: 'recetteTitle', type: 'string'},
        {name: 'ingredients', type: 'string'},
        {name: 'recette', type: 'string'},
        {name: 'visuelUrl', type: 'string'},
        {name: 'condition', type: 'int'},
        {name: 'infoCom', type: 'int'},
        {name: 'creation_date', type: 'string'},
        {name: 'statut', type: 'int'},
        {name: 'typeRecetteListe', type: 'string'},
        {name: 'idSite', type: 'int'}],
    proxy: {
        type: 'texto',
        extraParams: {
            API: 'Cmsmodules_Model_RecetteMapper',
            APICall: 'fetchAllClient',
            where: 'id_site=' + TextoCMS.siteId
        }
    }

});