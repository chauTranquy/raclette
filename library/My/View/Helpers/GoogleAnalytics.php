<?php 
class My_View_Helpers_GoogleAnalytics extends Zend_View_Helper_Abstract
{
    public $view;
 
    public function setView(Zend_View_Interface $view)
    {
        $this->view = $view;
    }
    
    
 	/**
 	 * Create the GoogleAnalytics javascript
 	 * @param option string $funnel like "/funnel_G1/step1.html"
 	 * @param option string $id of the GoogleAnalytics account
 	 * 
 	 * @return void display the javascript with zend_view::inlineScript()
 	 */
	public function GoogleAnalytics($funnel=null, $id="UA-423998-9")
	{
	
		
$this->view->inlineScript()->captureStart(); ?>
	var _gaq = _gaq || [];
  _gaq.push(['_setAccount', '<?php echo $id; ?>']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
<?php $this->view->inlineScript()->captureEnd();
        
	}
}