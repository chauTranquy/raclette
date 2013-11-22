<?php // PHP SCRIPT FOR SARBACANE 3
if(isset($_GET['toreg'])){
	if($_GET['toreg']==1){echo 'http://tk3.mail54.com/sy/ub?';}
	exit();
}else{
	$var='';
	if($_SERVER['QUERY_STRING']!=''){$var=$_SERVER['QUERY_STRING'];}
	else{foreach($_GET as $cle => $valeur){$var.=($var!='')?'&':'?'; $var.=$cle.'='.$valeur;}}
	Header("Location: http://tk3.mail54.com/sy/ub?".$var);
}
?>