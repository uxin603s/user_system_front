angular.module('app').component("webList",{
bindings:{
	
},
templateUrl:'app/components/webList/webList.html?t='+Date.now(),
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
			// {
				// enName:'role',
				// name:"腳色",
			// },
			// {
				// enName:'fb_id',
				// name:"FB綁定",
			// },
			// {
				// enName:'status',
				// name:"狀態",
				// list:[
					// {id:0,name:"空缺"},
					// {id:1,name:"在職"},
					// {id:2,name:"離職"},
				// ]
			// },
			// {
				// enName:'created_time_int',
				// name:"創建時間",
			// },
		],
		order:["id"],
		default:{
			where:{field:'name',type:"2"},
			order:{field:'id',type:"1"},
		}
	}
	
	$scope.cache.limit || ($scope.cache.limit={page:0,count:10,total_count:0});
	$scope.cache.where_list || ($scope.cache.where_list=[]);
	$scope.cache.order_list || ($scope.cache.order_list=[{field:'created_time_int',type:1}]);
	
	
	
	$scope.get=function(){
		$scope.message="查詢中...";
		console.log($scope.cache.limit)
		clearTimeout($scope.getTimer);
		$scope.getTimer=setTimeout(function(){
			crud.get("WebList",{
				where_list:$scope.cache.where_list,
				order_list:$scope.cache.order_list,
				limit:$scope.cache.limit,
			})
			.then(function(res){
				if(res.status){
					$scope.message="完成查詢!!";
					$scope.list=res.list;
				}else{
					$scope.message="完成查詢，沒有資料!!";
					$scope.list=[];
				}
				console.log(res)
				$scope.cache.limit.total_count=res.total_count;
				$scope.$apply();
			})
		},0)
		
		
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