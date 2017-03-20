angular.module('app').component("userList",{
bindings:{
	cache:"=",
},
templateUrl:'app/components/userList/userList.html?t='+Date.now(),
controller:["$scope","$http","$timeout",function($scope,$http,$timeout){
	$scope.status_list=["空缺","在職","離職"];
	
	$scope.$ctrl.$onInit=function(){
		$scope.$ctrl.cache.limit || ($scope.$ctrl.cache.limit={page:0,count:10,total_count:0});
		$scope.$ctrl.cache.where_list || ($scope.$ctrl.cache.where_list={});
		$scope.$ctrl.cache.order_list || ($scope.$ctrl.cache.order_list=[]);
		$scope.$ctrl.cache.select_wid || ($scope.$ctrl.cache.select_wid=[]);
		$scope.$ctrl.cache.searchRole || ($scope.$ctrl.cache.searchRole=[]);
		
		var timer;
		$scope.page_get=function(){
			clearTimeout(timer);
			timer=setTimeout($scope.get,50);
		}
		var timer1;
		$scope.$watch("list",function(list){
			if(!list)return;
			$timeout.cancel(timer1);
			timer1=$timeout(function(){
				var uids=$scope.list.map(function(val){return val.id});
				$scope.getUserRole(uids)
			},50)
		},1)
		$scope.getWebList();
		$scope.$watch("$ctrl.cache.select_wid",function(select_wid){
			$scope.getRoleList(select_wid);
		},1)
		
		$scope.$watch("$ctrl.cache.where_list",$scope.page_get,1)
		$scope.$watch("$ctrl.cache.searchRole",function(searchRole){
			// console.log(searchRole)
			$scope.$ctrl.cache.where_list.id=[];
			
			if(searchRole.length){
				for(var i in searchRole){
					var rid=searchRole[i];
					var where_list=[
						{field:'rid',type:0,value:rid},
					];
					var post_data={
						func_name:"UserRole::getList",
						arg:{
							where_list:where_list,
						},
					};
					$http.post("ajax.php",post_data).then(function(result){
						var res=result.data;
						if(res.status){
							for(var i in res.list){
								var item=res.list[i];
								var uid=item.uid;
								if($scope.$ctrl.cache.where_list.id.indexOf(uid)==-1){
									$scope.$ctrl.cache.where_list.id.push(uid);
								}
							}
						}
					})
				}
			}
			
		},1)
	}
	
	$scope.get=function(){
		$scope.message="查詢中...";
		var where_list=[];
		var id=$scope.$ctrl.cache.where_list.id;
		if(id.length){
			for(var i in id){
				where_list.push({field:'id',type:0,value:id[i]})
			}
		}
		var status=$scope.$ctrl.cache.where_list.status;
		if(!isNaN(status)){
			where_list.push({field:'status',type:0,value:status})
		}
		var name=$scope.$ctrl.cache.where_list.name;
		if(name){
			where_list.push({field:'name',type:2,value:"%"+name+"%"})
		}
		var post_data={
			func_name:"UserList::getList",
			arg:{
				where_list:where_list,
				limit:$scope.$ctrl.cache.limit,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			$scope.message="完成查詢!!";
			if(res.status){
				$scope.list=res.list;
				$scope.$ctrl.cache.limit.total_count=res.total_count;
			}else{
				$scope.list=[];
				$scope.$ctrl.cache.limit.total_count=0;
				if(res.reload){
					location.reload();
				}
			}
		})
	}
	$scope.add=function(arg){
		var post_data={
			func_name:"UserList::insert",
			arg:arg,
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			delete arg.name;
			if(res.status){
				$scope.list.unshift(res.insert);
				$scope.message="新增成功!!!"
			}else{
				$scope.message="新增失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
		})
	}
	$scope.ch=function(update,where){
		var post_data={
			func_name:"UserList::update",
			arg:{
				update:update,
				where:where,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			console.log(res)
			
		})
	}
	// UserRole
	$scope.UserRole={};
	$scope.getUserRole=function(uids){
		var where_list=[];
		for(var i in uids){
			where_list.push({field:'uid',type:0,value:uids[i]})
		}
		var post_data={
			func_name:"UserRole::getList",
			arg:{
				where_list:where_list,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					var uid=item.uid;
					var rid=item.rid;
					$scope.UserRole[uid] || ($scope.UserRole[uid]={});
					$scope.UserRole[uid][rid]=item
				}
				var rids=res.list.map(function(val){return val.rid});
				// $scope.getRoleList(rids)
			}
			
		})
	}
	$scope.delUserRole=function(arg){
		var post_data={
			func_name:"UserRole::delete",
			arg:arg,
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				var uid=arg.uid;
				var rid=arg.rid;
				delete $scope.UserRole[uid][rid];
			}
			console.log(res)
		})
	}
	$scope.addUserRole=function(arg){
		var post_data={
			func_name:"UserRole::insert",
			arg:arg,
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			console.log(res)
			if(res.status){
				var uid=arg.uid;
				var rid=arg.rid;
				$scope.UserRole[uid] || ($scope.UserRole[uid]={});
				$scope.UserRole[uid][rid]=arg;
			}
		})
	}
	$scope.swUserRole=function(arg){
		if($scope.UserRole[arg.uid] && $scope.UserRole[arg.uid][arg.rid]){
			$scope.delUserRole(arg);
		}else{
			$scope.addUserRole(arg);
		}
	}
	
	
	$scope.getRoleList=function(wids){
		$scope.RoleList={};
		if(!wids.length){
			return
		}

		var where_list=[];
		for(var i in wids){
			where_list.push({field:'wid',type:0,value:wids[i]})
		}
		
		var post_data={
			func_name:"RoleList::getList",
			arg:{
				where_list:where_list,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			// console.log(res)
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					var rid=item.id;
					var wid=item.wid;
					var name=item.name;
					// $scope.RoleList || ($scope.RoleList={});
					$scope.RoleList[wid] || ($scope.RoleList[wid]={});
					$scope.RoleList[wid][rid]=name;
				}
				// console.log($scope.RoleList)
			}
		})
	}
	$scope.resetAccessToken=function(item){
		var post_data={
			func_name:"UserList::resetAccessToken",
			arg:{
				id:item.id,
			}
		}
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				item.access_token=res.update['access_token'];
			}
		})
	}
	
	$scope.getWebList=function(){
		var where_list=[];
		
		var post_data={
			func_name:"WebList::getList",
			arg:{
				where_list:where_list,
			},
		};
		$http.post("ajax.php",post_data).then(function(result){
			var res=result.data;
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					var id=item.id;
					var name=item.name;
					$scope.WebList || ($scope.WebList={})
					$scope.WebList[id]=name;
				}
				
			}
		})
	}
	
	$scope.setSearchRole=function(rid){
		// console.log(rid,$scope.searchRole[rid])
		var index=$scope.$ctrl.cache.searchRole.indexOf(rid);
		if(index==-1){
			$scope.$ctrl.cache.searchRole.push(rid);
		}else{
			$scope.$ctrl.cache.searchRole.splice(index,1);
		}
	}
		// var where_list=[];
		// var post_data={
			// func_name:"UserRole::getList",
			// arg:{
				// where_list:where_list,
			// },
		// };
		// $http.post("ajax.php",post_data).then(function(result){
			// var res=result.data;
			// if(res.status){
				// for(var i in res.list){
					// var item=res.list[i];
					// var id=item.id;
					// var name=item.name;
					// $scope.WebList || ($scope.WebList={})
					// $scope.WebList[id]=name;
				// }
				
			// }
		// })
		// $scope.$ctrl.cache.where_list.uids
		// console.log(rid)
	// }
}],
})