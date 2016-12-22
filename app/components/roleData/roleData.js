angular.module('app').component("roleData",{
bindings:{
	
},
templateUrl:'app/components/roleData/roleData.html?t='+Date.now(),
controller:["$scope","crud",function($scope,crud){
	$scope.get=function(table){
		var where_list=[];
		
		crud.get(table)
		.then(function(res){
			if(res.status){
				$scope[table]=res.list;
				$scope[table+"Name"] || ($scope[table+"Name"]={})
				$scope[table+"NameR"] || ($scope[table+"NameR"]={})
				$scope[table+"Wid"] || ($scope[table+"Wid"]={})
				for(var i in res.list){
					$scope[table+"Name"][res.list[i].id]=res.list[i].name;
					$scope[table+"NameR"][res.list[i].name]=res.list[i].id;
					$scope[table+"Wid"][res.list[i].id]=res.list[i].wid;
				}
			}
			$scope.$apply();
		})
	}
	$scope.get("webList");
	$scope.get("RoleList");
	$scope.get("DataList");
	
	$scope.getRoleData=function(){
		if(!$scope.cache.role_select){
			return
		}
		var arg={
			where_list:[
				{field:'rid',type:0,value:$scope.cache.role_select},
			]
		}
		crud.get("RoleData",arg)
		.then(function(res){
			$scope.list={};
			if(res.status){
				for(var i in res.list){
					var item=res.list[i];
					$scope.list[item.did] || ($scope.list[item.did]={});
					$scope.list[item.did][item.action] || ($scope.list[item.did][item.action]={});
					$scope.list[item.did][item.action][item.aid]=item;
				}
			}
			$scope.$apply();
		})
	}
	$scope.$watch("cache.role_select",$scope.getRoleData,1);	
}],
})