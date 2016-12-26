angular.module('app').component("blockList",{
bindings:{
	
},
templateUrl:'app/components/blockList/blockList.html?t='+Date.now(),
controller:["$scope","crud",function($scope,crud){
	$scope.time=Math.floor(Date.now()/1000);
	setInterval(function(){
		
		$scope.time=Math.floor(Date.now()/1000)
		$scope.$apply();
	},1000)
	crud.get("BlockList")
	.then(function(res){
		if(res.status){
			$scope.list=res.list;
			$scope.$apply();
		}
	})
	$scope.unlock=function(index){
		var ip=$scope.list.splice(index,1).pop().ip
		var arg={
			ip:ip,
		}
		crud.del("BlockList",arg)
		.then(function(res){
			console.log(res)
			
		})
	}
	
	
}],
})