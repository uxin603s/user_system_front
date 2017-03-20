angular.module('app').component("fbRegisterList",{
bindings:{
	cache:"=",
},
templateUrl:'app/components/fbRegisterList/fbRegisterList.html?t='+Date.now(),
controller:["$scope","$http",function($scope,$http){
	$scope.status_list=[
		"未審核",
		"成功",
		"拒絕",
	];
	$scope.uid_bind_fb_id=[
		"未綁定",
		"綁定",
	];
	$scope.$ctrl.$onInit=function(){
		$scope.$ctrl.cache.limit || ($scope.$ctrl.cache.limit={page:0,count:10,total_count:0});
		$scope.$ctrl.cache.where_list || ($scope.$ctrl.cache.where_list={status:0});
		// $scope.$ctrl.cache.order_list || ($scope.$ctrl.cache.);
		var timer;
		$scope.page_get=function(){
			clearTimeout(timer)
			timer=setTimeout($scope.get,50)
		}
		$scope.$watch("$ctrl.cache.where_list",function(where_list){
			$scope.page_get();
		},1)
	}
	
	$scope.get=function(){
		var where_list=[]
		var status=$scope.$ctrl.cache.where_list.status;
		var uid_bind_fb_id=$scope.$ctrl.cache.where_list.uid_bind_fb_id;
		if(!isNaN(status)){
			where_list.push({field:'status',type:0,value:status})
		}
		if(!isNaN(uid_bind_fb_id)){
			where_list.push({field:'uid',type:uid_bind_fb_id,value:0})
		}
		$scope.message="查詢中...";
		var post_data={
			func_name:"FbRegisterList::getList",
			arg:{
				where_list:where_list,
				order_list:[{field:'created_time_int',type:1}],
				limit:$scope.$ctrl.cache.limit,
			},
		}
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			$scope.message="完成查詢!!";
			if(res.status){
				$scope.list=res.list;
				$scope.$ctrl.cache.limit.total_count=res.total_count
			}else{
				$scope.list=[];
				$scope.$ctrl.cache.limit.total_count=0;
				if(res.reload){
					location.reload();
				}
			}
			
		})
	}
	$scope.ch=function(update,where){
		var post_data={
			func_name:"FbRegisterList::update",
			arg:{
				update:update,
				where:where,
			},
		}
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			console.log(res)
		});
	}
	$scope.addUserList=function(item){
		$scope.ch({
			uid:item.uid,
		},{
			id:item.id,
		})
	}
	
}],
})