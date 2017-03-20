angular.module('app').component("fbRegisterList",{
bindings:{
	cache:"=",
},
templateUrl:'app/components/fbRegisterList/fbRegisterList.html?t='+Date.now(),
controller:["$scope",function($scope){
	$scope.status_list=[
		{id:0,name:"申請中"},
		{id:1,name:"申請成功"},
		{id:2,name:"已拒絕"},
	];
	
	$scope.$ctrl.cache || ($scope.$ctrl.cache={
		limit:{page:0,count:10,total_count:0},
		where_list:[{field:'status',type:0,value:0}],
		order_list:[{field:'created_time_int',type:1}],
	})
	// $scope.cache.fbR_limit || ($scope.cache.fbR_limit={page:0,count:10,total_count:0});
	// $scope.cache.fbR_where_list || ($scope.cache.fbR_where_list=[{field:'status',type:0,value:0}]);
	// $scope.cache.fbR_order_list || ($scope.cache.fbR_order_list=[{field:'created_time_int',type:1}]);
	
	// $scope.add_where_list=whereListFunc.add_where_list.bind(this,$scope.cache.fbR_where_list);
	// $scope.add_order_list=whereListFunc.add_order_list.bind(this,$scope.cache.fbR_order_list);

	
	$scope.get=function(){
		clearTimeout($scope.getTimer)
		$scope.getTimer=setTimeout(function(){
			$scope.message="查詢中...";
			var post_data={
				func_name:'FbRegisterList::getList',
				arg:{
					where_list:$scope.cache.fbR_where_list,
					order_list:$scope.cache.fbR_order_list,
					limit:$scope.cache.fbR_limit,
				},
			}
			$.post("ajax.php",post_data,function(res){
				$scope.message="完成查詢!!";
				if(res.status){
					$scope.list=res.list;
					console.log($scope.list)
				}else{
					$scope.list=[];
					if(res.reload){
						location.reload();
					}
				}
				$scope.cache.fbR_limit.total_count=res.total_count
				$scope.$apply();
			},"json");	
		},50)
		
	}
	$scope.ch=function(update,where){
		crud.ch("FbRegisterList",{
			update:update,
			where:where,
		})
		.then(function(res){
			$scope.get();
			$scope.$apply();
		})
	}
	$scope.addUserList=function(item){
		if(item.uid){
			var update={
				fb_id:item.id,
				// name:item.name,
			}
			var where={
				id:item.uid,
			}
			crud.ch("UserList",{update:update,where:where})
			.then(function(res){
				if(res.status){
					$scope.ch({status:1,uid:item.uid},{id:item.id});
					alert("註冊成功")
				}else{
					alert("註冊失敗")
					if(res.reload){
						location.reload();
					}
				}
				$scope.$apply();
			})
		}else{
			var add={
				fb_id:item.id,
				name:item.name,
			}
			crud.add("UserList",add)
			.then(function(res){
				if(res.status){
					$scope.ch({status:1,uid:item.uid},{id:item.id});
					
					alert("註冊成功")
				}else{
					alert("註冊失敗")
					if(res.reload){
						location.reload();
					}
				}
				$scope.$apply();
			})
		}
	}
	
}],
})