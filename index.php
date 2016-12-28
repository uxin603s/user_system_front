<?php
session_start();


if(isset($_SESSION['rid'])){
	if(in_array(0,$_SESSION['rid'])){
		
	}else{
		echo "<pre>";
		var_dump($_SESSION);
		echo "權限不足";
		exit;
	}
}else{
	header("location:login.php");
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />

<script src="js/jquery.min.js"></script>
<script src="js/angular.min.js"></script>
<script src="js/localForage-1.4.2.min.js"></script>
<script src="js/postMessageHelper/postMessageHelper.js"></script>
<script src="app/module/cache/cache.js?t=<?=time();?>"></script>
<script src="app/module/whereList/whereList.js?t=<?=time();?>"></script>

<script src="app/app.js?t=<?=time();?>"></script>
<script src="app/components/index/index.js?t=<?=time();?>"></script>
<script src="app/components/fbRegisterList/fbRegisterList.js?t=<?=time();?>"></script>
<script src="app/components/userList/userList.js?t=<?=time();?>"></script>
<script src="app/components/webList/webList.js?t=<?=time();?>"></script>
<script src="app/components/roleData/roleData.js?t=<?=time();?>"></script>
<script src="app/components/roleDataChild/roleDataChild.js?t=<?=time();?>"></script>



<script src="app/components/blockList/blockList.js?t=<?=time();?>"></script>

<script src="app/factories/crud.js?t=<?=time();?>"></script>


<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>
<script src="app/directives/sortable/sortable.js?t=<?=time();?>"></script>

<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">

</head>
<body ng-app="app"  style="overflow-y:scroll;">
<pre>
<?=$_SESSION['name']?$_SESSION['name']:"最高高權限"?>
<?=json_encode($_SESSION['rid'])?>
</pre>
	<index 
	ng-if="!cache.not_finish_flag"
	class="container"
	></index>
</body>
</html>