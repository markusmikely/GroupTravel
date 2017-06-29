var app= angular.module("twinApp", ['ngCookies', 'ui.router', 'ngMap', 'ngAnimate', "kendo.directives", 'ngAffix'])
	.provider('modalState', modalProvider)
  .run(run)
	.config(config)
	.factory('PagerService', PagerService)
	.service("ApiService", ApiService)
	.service("CartService", CartService)
	.service("AttractionService", AttractionService)
	.service("MapService", MapService)
	.service("RankingService", RankingService)
	.service("SearchService", SearchService)
	.service("CookieService", CookieService)
	.controller('HomeController', HomeController)
	.controller('AttractionController', AttractionController)
	.controller('SearchController', SearchController)
	.controller('SelectionController', SelectionController)
	.directive('affixer', function ($window) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            var win = angular.element($window);
            var topOffset = $element[0].offsetTop;

            function affixElement() {

                console.log($window.pageYOffset);

                if ($window.pageYOffset > topOffset) {
                    $element.css('position', 'fixed');
                    $element.css('top', '0px');
                } else {
                    $element.css('position', '');
                    $element.css('top', '');
                }
            }

            $scope.$on('$routeChangeStart', function() {
                win.unbind('scroll', affixElement);
            });
            win.bind('scroll', affixElement);
        }
    };
})
.directive('dynPlaceholder', function()
{
    return {
        restrict: 'E',
        link: function(scope, element, attrs)
        {
            element.bind('focus', function(){
							attrs.$set('placeholder', 'Test');
						});
						element.bind('blur', function(){
							attrs.$set('placeholder', 'Test2');
						});
        }
    }
})
.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
