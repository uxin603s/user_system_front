angular.module('app').component("ipList",{
bindings:{
	cache:"=",
},
templateUrl:'app/components/ipList/ipList.html?t='+Date.now(),
controller:["$scope","$http","$timeout",function($scope,$http,$timeout){
	$scope.$ctrl.$onInit=function(){
		$scope.$ctrl.cache.insert || ($scope.$ctrl.cache.insert={
			// status:0,
			keep_time_int:-1,
		});
		
		$scope.$ctrl.cache.limit || ($scope.$ctrl.cache.limit={page:0,count:10,total_count:0});
		var timer;
		$scope.page_get=function(){
			$timeout.cancel(timer)
			timer=$timeout($scope.get,50);
		}
		$scope.$watch("$ctrl.cache.insert",function(insert){
			$scope.page_get();
		},1)
	}
	$scope.confirm=window.confirm.bind(window);
	
	$scope.status_arr=["黑名單","白名單"];
	$scope.add=function(arg){
		if(!arg.ip){
			alert("請勿空白")
			return;
		}
		var ip=arg.ip;
		var status=arg.status;
		var keep_time_int=arg.keep_time_int;
		delete arg.ip;
		
		var post_data={
			func_name:"IPList::insert",
			arg:{
				ip:ip,
				keep_time_int:keep_time_int,
				status:status,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				$scope.list.unshift(res.insert);
			}
			console.log(res);
		})
	}
	$scope.get=function(){
		var where_list=[];
		
		var ip=$scope.$ctrl.cache.insert.ip;
		var status=$scope.$ctrl.cache.insert.status;
		if(ip){
			where_list.push({field:'ip',type:2,value:"%"+ip+"%"})
		}
		if(!isNaN(status)){
			where_list.push({field:'status',type:0,value:status})
		}
		
		var post_data={
			func_name:"IPList::getList",
			arg:{
				where_list:where_list,
				limit:$scope.$ctrl.cache.limit,
				order_list:[{field:'last_time_int',type:0}]
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				$scope.list=res.list;
				$scope.$ctrl.cache.limit.total_count=res.total_count;
			}else{
				$scope.list=[];
				$scope.$ctrl.cache.limit.total_count=0;
			}
			// console.log(res);
		})
	}
	$scope.ch=function(update,where){
		var post_data={
			func_name:"IPList::update",
			arg:{
				update:update,
				where:where,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			
			console.log(res);
		})
	}
	$scope.del=function(index){
		if(!confirm("確定刪除?"))return;
		var item=$scope.list.splice(index,1).pop();
		var ip=item.ip
		var post_data={
			func_name:"IPList::delete",
			arg:{
				ip:ip,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(!res.status){
				$scope.list.splice(index,0,item);
			}
			console.log(res);
		})
	}
}],
})