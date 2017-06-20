function modalProvider($stateProvider) {
        var provider = this;
        this.$get = function() {
            return provider;
        }
        this.state = function(stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                onEnter: function($modal, $state) {
                    modalInstance = $modal.open(options);
                    modalInstance.result['finally'](function() {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^');
                        }
                    });
                },
                onExit: function() {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            });
        };
    }
    function config($stateProvider, $urlRouterProvider, modalStateProvider, $sceDelegateProvider) {
         $sceDelegateProvider.resourceUrlWhitelist([
          'self',
          'http://www.youtube.com/**',
          'https://www.youtube.com/**'
        ]);
        $urlRouterProvider.otherwise('/');

        var homeState = {
          name: 'home',
	        url: '/',
		      templateUrl : "app/components/home/home.view.htm",
		    }
        var attractionState = {
          name: 'attraction',
	        url: '/attraction/{id}',
		      templateUrl : "app/components/attraction/attraction.view.htm",
		    }
        var searchState = {
          name: 'search',
	        url: '/search',
		      templateUrl : "app/components/search/search.view.htm",
		    }


        $stateProvider.state(homeState);
        $stateProvider.state(searchState);
        $stateProvider.state(attractionState);

    }
