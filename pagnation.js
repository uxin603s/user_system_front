angular.module("app").directive("pagnation",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/pagnation/pagnation.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			data:'=',
			callback:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.stop_watch=$scope.$watch('data',function(value){
				// console.log(value)
				if(!value)return;
				$scope.stop_watch();
				
				var wacth_page_arr=function(){
					$scope.page_arr=[];
					if($scope.data.limit_count!=0){
						$scope.page_count=Math.ceil($scope.data.total_count/$scope.data.limit_count);
						
						for(var i=0;i<$scope.page_count;i++){
							$scope.page_arr.push(i);
						}
					}
					// console.log($scope.page_arr)
				}
				$scope.$watch('data.total_count',wacth_page_arr);
				$scope.$watch('data.limit_page',function(value){
					if(isNaN(value))return;
					$scope.page_start=$scope.data.limit_page-3;				
					$scope.page_end=$scope.data.limit_page+3;
					if($scope.page_start < 0){
						$scope.page_end-=$scope.page_start;
					}
					if($scope.page_end > $scope.page_count){
						$scope.page_start-=$scope.page_end-$scope.page_count;
					}
					// console.log('limit_page',value)
					
					$scope.callback && $scope.callback();
				});
				$scope.$watch('data.limit_count',function(value){
					if(!value)return;
					$scope.data.limit_page=0;
					wacth_page_arr();
					
					$scope.callback && $scope.callback();
					
				});
			},1)
        },
    }
}]);