angular.module('app').component("webList",{
bindings:{
	cache:"=",
},
templateUrl:'app/components/webList/webList.html?t='+Date.now(),
controller:["$scope","crud",function($scope,crud){
	
	$scope.$ctrl.$onInit=function(){
		$scope.$ctrl.cache.limit || ($scope.$ctrl.cache.limit={page:0,count:10,total_count:0});
		$scope.page_get=function(){
			clearTimeout($scope.getTimer);
			$scope.getTimer=setTimeout($scope.get,50)
		}
	}
	
	$scope.get=function(){
		$scope.message="查詢中...";
		
		crud.get("WebList",{
			limit:$scope.$ctrl.cache.limit,
		})
		.then(function(res){
			// console.log(res)
			if(res.status){
				$scope.message="完成查詢!!";
				$scope.list=res.list;
				var ids=res.list.map(function(res){
					return res.id;
				});
				$scope.$ctrl.cache.limit.total_count=res.total_count;
				$scope.getRelation("RoleList",ids);
				$scope.getRelation("DataList",ids);
			}else{
				$scope.message="完成查詢，沒有資料!!";
				$scope.list=[];
				$scope.$ctrl.cache.limit.total_count=0;
				if(res.reload){
					location.reload();
				}
			}
			// console.log(res)
			
			$scope.$apply();
		})
		
	}
	
	
	$scope.add=function(arg){
		crud.add("WebList",arg)
		.then(function(res){
			delete arg.name;
			if(res.status){
				$scope.list.push(res.insert);
				$scope.message="新增成功!!!"
			}else{
				$scope.message="新增失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
			$scope.$apply();
		})
	}
	$scope.del=function(index){
		if(!confirm("確定刪除?"))return;
		var arg=angular.copy($scope.list.splice(index,1)).pop();
		crud.del("WebList",arg)
		.then(function(res){
			if(res.status){
				$scope.message="刪除成功!!!"
			}else{
				$scope.message="刪除失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
			$scope.$apply();
		});
	}
	$scope.ch=function(update,where,callback){
		$scope.message="修改中...";
		var ch_item=$scope.list.find(function(val){
			var flag=true;
			for(var i in where){
					flag=flag && val[i]==where[i];
			}
			return flag;
		})
		callback && callback(ch_item,update,where);
		crud.ch("WebList",{
			update:update,
			where:where,
		})
		.then(function(res){
			if(res.status){
				for(var i in update){
					ch_item[i]=update[i];
				}
				$scope.message="修改成功!!!"
			}else{
				$scope.message="修改失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
			$scope.$apply();
		})
	}
	
	$scope.text_ch=function(update,where){
		$scope.message="修改中...";
		var timer_name="text_change_timer";
		for(var i in where){
			timer_name+=i+":"+where[i];
		}
		clearTimeout($scope[timer_name]);
		$scope[timer_name]=setTimeout(function(){
			$scope.ch(update,where)
		},500)
	}
	$scope.addRelation=function(table,arg){
		crud.add(table,arg)
		.then(function(res){
			delete arg.name;
			if(res.status){
				$scope[table][res.insert.wid] || ($scope[table][res.insert.wid]=[])
				$scope[table][res.insert.wid].push(res.insert);
				$scope.message="新增成功!!!"
			}else{
				$scope.message="新增失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
			$scope.$apply();
		})
	}
	
	$scope.watch={}
	
	$scope.getRelation=function(table,ids){
		var where_list=[];
		for(var i in ids){
			where_list.push({field:'wid',type:0,value:ids[i]})
		}
		var arg={
			where_list:where_list,
		}
		crud.get(table,arg)
		.then(function(res){
			for(var wid in $scope[table]){
				$scope.watch[wid] && $scope.watch[wid]();
			}
			$scope[table]={};
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					$scope[table][item.wid] || ($scope[table][item.wid]=[])
					$scope[table][item.wid].push(item);
				}
			}else{
				if(res.reload){
					location.reload();
				}
			}
			
			for(var wid in $scope[table]){
				$scope[table][wid].sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.watch[wid]=$scope.$watch(table+"["+wid+"]",crud.sort.bind(this,table,'id'),1)
			}
			// console.log($scope.watch);
			$scope.$apply();
		})
	}
	$scope.delRelation=function(table,arg){
		if(!confirm("確定刪除?"))return;
		crud.del(table,arg)
		.then(function(res){
			if(res.status){
				var index=$scope[table][arg.wid].findIndex(function(val){
					return val.id==arg.id
				})
				if(index!=-1){
					$scope[table][arg.wid].splice(index,1);
				}
				
				$scope.message="刪除成功!!!"
			}else{
				$scope.message="刪除失敗!!!"
				if(res.reload){
					location.reload();
				}
			}
			$scope.$apply();
		})
		
	}
	$scope.chRelationText=function(table,update,where){
		$scope.message="修改中...";
		var timer_name="text_change_timer"+table;
		for(var i in where){
			timer_name+=i+":"+where[i];
		}
		clearTimeout($scope[timer_name]);
		$scope[timer_name]=setTimeout(function(){
			crud.ch(table,{update:update,where:where})
			.then(function(res){
				if(res.status){
					$scope.message="修改成功!!!"
				}else{
					$scope.message="修改失敗!!!"
					if(res.reload){
						location.reload();
					}
				}
				$scope.$apply();
			})
		},500)
	}
}],
})