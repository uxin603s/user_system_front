angular.module('app').component("fbRegisterList",{
bindings:{
	
},
templateUrl:'app/components/fbRegisterList/fbRegisterList.html?t='+Date.now(),
controller:["$scope",function($scope){
	
	var post_data={
		func_name:'FbRegisterList::getList',
		arg:{
			order_list:[
				{field:'created_time_int',type:1}
			]
		},
	}
	$.post("ajax.php",post_data,function(res){
		if(res.status){
			$scope.list=res.list;
		}
		$scope.$apply();
	},"json");	
}],
})