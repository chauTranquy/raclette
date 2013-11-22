Ext.define('TextoCMS.Modules.glutabye.model.TypeRecetteListeModel', {
    extend: 'Ext.data.Model',
    //idProperty: 'id_ajoutRecette',
    fields: [
        {name: 'id_rubrique'},
        {name: 'titre', type: 'string'}
        ],
    proxy: {
        type: 'texto',
        extraParams: {
            API: 'Cmsmodules_Model_RecetteMapper',
            APICall: 'getAllTypeList',
            where: 'id_site=' + TextoCMS.siteId
        }
    }

});