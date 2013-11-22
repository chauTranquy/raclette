/**
 * 
 */

CKEDITOR.plugins.add('cmslink',{
  init:function(editor){
	  
	  editor.addCommand('cmslink', {exec:cmslink_onclick});
	  editor.ui.addButton('cmslink',{ label:'Ajouter un lien', command:'cmslink',
icon:'/admin/ckeditor/plugins/cmslink/images/link_edit.png' });
  }
});

function cmslink_onclick(editor){
	
	editor.componentInstance.openLinkEditor(editor);
	
	
}