angular.module('app').component("roleDataChild",{
bindings:{
	list:'=',
	rid:'=',
	did:'=',
	action:'=',
},
templateUrl:'app/components/roleDataChild/roleDataChild.html?t='+Date.now(),
controller:["$scope","crud",function($scope,crud){
	var del_relation=function(item){
		return crud.del("RoleData",item)
		.then(function(res){
			if(res.status){
				delete $scope.$ctrl.list[item.did][item.action][item.aid];
				if(!Object.keys($scope.$ctrl.list[item.did][item.action]).length){
					delete $scope.$ctrl.list[item.did][item.action];
				}
				if(!Object.keys($scope.$ctrl.list[item.did]).length){
					delete $scope.$ctrl.list[item.did];
				}
				$scope.$apply();
			}else{
				if(res.reload){
					location.reload();
				}
			}
			
		})
	}
	var add_relation=function(item){
		crud.add("RoleData",item)
		.then(function(res){
			if(res.status){
				$scope.$ctrl.list[item.did] || ($scope.$ctrl.list[item.did]={});
				$scope.$ctrl.list[item.did][item.action] || ($scope.$ctrl.list[item.did][item.action]={});
				$scope.$ctrl.list[item.did][item.action][item.aid]=item;
				$scope.$apply();
			}else{
				if(res.reload){
					location.reload();
				}
			}
		})
	}
	$scope.relation=function(item){
		
		if($scope.$ctrl.list[item.did] && $scope.$ctrl.list[item.did][item.action] && $scope.$ctrl.list[item.did][item.action][item.aid]){
			// if(!confirm("確認移除關聯?")){
				// return;
			// }
			del_relation(item);
		}else{
			// if(!confirm("確認建立關聯?")){
				// return;
			// }
			if(item.aid){
				if($scope.$ctrl.list[item.did] && $scope.$ctrl.list[item.did][item.action] && $scope.$ctrl.list[item.did][item.action][0]){
					var del=angular.copy(item);
					del.aid=0;
					del_relation(del);
				}
			}else{
				if($scope.$ctrl.list[item.did] && $scope.$ctrl.list[item.did][item.action]){
					var list=$scope.$ctrl.list[item.did][item.action];
					for(var aid in list){
						var del=angular.copy(item);
						del.aid=aid;
						del_relation(del);
					}
				}
			}
			add_relation(item);
		}
	}
}],
})