angular.module('app').component("userList",{
bindings:{
	
},
templateUrl:'app/components/userList/userList.html?t='+Date.now(),
controller:["$scope","crud","whereListFunc",function($scope,crud,whereListFunc){
	$scope.status_list=[
		{id:0,name:"空缺"},
		{id:1,name:"在職"},
		{id:2,name:"離職"},
	]
	$scope.fieldStruct={
		field:[
			{
				enName:'id',
				name:"ID",
			},
			{
				enName:'name',
				name:"名稱",
			},		
			{
				enName:'fb_id',
				name:"FB綁定",
			},
			{
				enName:'status',
				name:"狀態",
				list:$scope.status_list,
			},
			{
				enName:'created_time_int',
				name:"創建時間",
			},
		],
		order:["created_time_int","id"],
		default:{
			where:{field:'status',type:"0",value:1},
			order:{field:'created_time_int',type:"1"},
		}
	}
	
	$scope.cache.user_limit || ($scope.cache.user_limit={page:0,count:10,total_count:0});
	$scope.cache.user_where_list || ($scope.cache.user_where_list=[{field:'status',type:0,value:1}]);
	$scope.cache.user_order_list || ($scope.cache.user_order_list=[]);
	
	$scope.add_where_list=whereListFunc.add_where_list.bind(this,$scope.cache.user_where_list);
	$scope.add_order_list=whereListFunc.add_order_list.bind(this,$scope.cache.user_order_list);
	
	
	$scope.get=function(){
		clearTimeout($scope.getTimer);
		$scope.getTimer=setTimeout(function(){
			$scope.message="查詢中...";
			crud.get("UserList",{
				where_list:$scope.cache.user_where_list,//.concat($scope.cache.user_where_list)
				order_list:$scope.cache.user_order_list,
				limit:$scope.cache.user_limit,
			})
			.then(function(res){
				$scope.message="完成查詢!!";
				if(res.status){
					$scope.list=res.list;
				}else{
					$scope.list=[];
				}
				$scope.cache.user_limit.total_count=res.total_count;
				$scope.$apply();
			})
		},50)
	}
		
	$scope.add=function(arg){
		// console.log(arg)
		// arg.status=0
		// arg.created_time_int=Math.floor(Date.now()/1000);
		crud.add("UserList",arg)
		.then(function(res){
			delete arg.name;
			if(res.status){
				$scope.list.unshift(res.insert);
				$scope.message="新增成功!!!"
			}else{
				$scope.message="新增失敗!!!"
			}
			$scope.$apply();
		})
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
		crud.ch("UserList",{
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
	
	$scope.$watch("list",function(list){
		if(!list)return;
		var timer_name="get_user_role_timer";
		clearTimeout($scope[timer_name]);
		$scope[timer_name]=setTimeout(function(){
			var uids=list.map(function(val){
				return val.id;
			})
			$scope.UserRole={};
			$scope.getUserRole(uids);			
		},50)
	},1)
	
	$scope.weblist={};
	$scope.getWeb=function(){
		crud.get("webList")
		.then(function(res){
			$scope.weblist.list=[];
			$scope.weblist.name={};
			delete $scope.weblist.select;
			if(res.status){
				$scope.weblist.list=res.list;
				for(var i in res.list){
					$scope.weblist.name[res.list[i].id]=res.list[i].name;
				}
				$scope.weblist.select=res.list[0].id;
				// $scope.selectRole($scope.weblist.select)
			}
			$scope.$apply();
		})
	}
	
	$scope.getWeb();
	
	$scope.rolelist={};
	$scope.getRole=function(){
		crud.get("roleList")
		.then(function(res){
			$scope.rolelist.list=[];
			$scope.rolelist.primary={};
			if(res.status){
				
				$scope.rolelist.list=res.list;
				for(var i in res.list){
					var item=res.list[i]
					$scope.rolelist.primary[item.id]=item;
				}
			}
			$scope.$apply();
		})
	}
	$scope.getRole();
	
	
	$scope.getUserRole=function(uids){
		var where_list=[];
		for(var i in uids){
			where_list.push({field:'uid',type:0,value:uids[i]})
		}
		crud.get("UserRole",{
			where_list:where_list,
		})
		.then(function(res){
			$scope.UserRole={};
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					var uid=item.uid;
					var rid=item.rid;
					$scope.UserRole[uid] || ($scope.UserRole[uid]=[]);
					$scope.UserRole[uid].push(rid);
				}
			}
			$scope.$apply();
		})
	}
	$scope.addUserRole=function(item){
		crud.add("UserRole",item)
		.then(function(res){
			if(res.status){
				var item=res.insert;
				var uid=item.uid;
				var rid=item.rid;
				$scope.UserRole[uid] || ($scope.UserRole[uid]=[]);
				$scope.UserRole[uid].push(rid);
				$scope.getRole([rid]);
				$scope.$apply();
			}
		})
	}
	
	
	
	$scope.delUserRole=function(item,no_check){
		if(!no_check && !confirm("確定刪除角色?!!"))return;
		crud.del("UserRole",item)
		.then(function(res){
			if(res.status){
				var uid=item.uid;
				var rid=item.rid;
				var index=$scope.UserRole[uid].findIndex(function(val){
					return val==rid;
				})
				if(index!=-1){
					$scope.UserRole[uid].splice(index,1)
				}
				
				$scope.$apply();
			}
		})
	}
	$scope.special=function(uid){
		if(!$scope.UserRole[uid] || $scope.UserRole[uid].indexOf(0)==-1){
			if(!confirm("確定新增最高權限?"))return;
			$scope.addUserRole({rid:0,uid:uid});
		}else{
			if(!confirm("確定移除最高權限?"))return;
			$scope.delUserRole({rid:0,uid:uid},1);
		}
	}
	$scope.getAccessToken=function(item){
		var post_data={
			func_name:"UserList::getAccessToken"
		}
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			$scope.ch({access_token:res},{id:item.id});
			item.access_token=res;
			$scope.$apply();
		},'json')
		
	}
}],
})