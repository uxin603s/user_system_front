angular.module('app').component("user",{
bindings:{
	
},
templateUrl:'app/components/user/user.html?t='+Date.now(),
controller:["$scope","crud",function($scope,crud){
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
				enName:'role',
				name:"腳色",
			},
			{
				enName:'fb_id',
				name:"FB綁定",
			},
			{
				enName:'status',
				name:"狀態",
				list:[
					{id:0,name:"空缺"},
					{id:1,name:"在職"},
					{id:2,name:"離職"},
				]
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
	
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	$scope.cache.where_list || ($scope.cache.where_list=[]);
	$scope.cache.order_list || ($scope.cache.order_list=[{field:'created_time_int',type:1}]);
	
	
	
	$scope.get=function(){
		$scope.message="查詢中...";
		crud.get("UserList",{
			where_list:$scope.cache.where_list,
			order_list:$scope.cache.order_list,
			limit:$scope.cache.limit,
		})
		.then(function(res){
			$scope.message="完成查詢!!";
			if(res.status){
				$scope.list=res.list;
			}else{
				$scope.list=[];
			}
			$scope.cache.limit.total_count=res.total_count;
			$scope.$apply();
		})
		
	}
	
	
	$scope.add=function(arg){
		arg.status=0
		arg.created_time_int=Math.floor(Date.now()/1000);
		crud.add("UserList",arg)
		.then(function(res){
			delete arg.name;
			if(res.status){
				$scope.list.push(res.insert);
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

	
}],
})