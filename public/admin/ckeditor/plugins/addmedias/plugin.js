/**
 * plugin pour cms add Media
 */

CKEDITOR.plugins.add('addmedias',{
  init:function(editor){
	  console.log(editor);
	  editor.addCommand('addmedias', {exec:addmedias_onclick});
	  editor.ui.addButton('addmedias',{ label:'Ajouter un media !!!!', command:'addmedias',
icon:'/admin/ckeditor/plugins/addmedias/images/image_add.png' });
  }
});

function addmedias_onclick(editor){

	editor.componentInstance.openMediaWindow(editor);
	
	
}