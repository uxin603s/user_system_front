<?php
session_start();

if(!isset($_SESSION['uid'])){
	echo "權限不足";
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

<script src="app/app.js?t=<?=time();?>"></script>
<script src="app/components/fbRegisterList/fbRegisterList.js?t=<?=time();?>"></script>
<script src="app/components/user/user.js?t=<?=time();?>"></script>
<script src="app/components/webList/webList.js?t=<?=time();?>"></script>
<script src="app/components/whereList/whereList.js?t=<?=time();?>"></script>
<script src="app/factories/crud.js?t=<?=time();?>"></script>


<script src="app/directives/pagnation/pagnation.js?t=<?=time();?>"></script>
<script src="app/directives/ngEnter/ngEnter.js?t=<?=time();?>"></script>
<script src="app/directives/ngRightClick/ngRightClick.js?t=<?=time();?>"></script>
<script src="app/directives/sortable/sortable.js?t=<?=time();?>"></script>

<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css?t=<?=time();?>">
<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time();?>">

</head>
<body ng-app="app" class="container" style="overflow-y:scroll;">
	<fb-register-list 
	ng-if="0"
	></fb-register-list>
	
	<user 
	ng-if="0"	
	></user>
	<web-list 	
	></web-list>
</body>
</html>