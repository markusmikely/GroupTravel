SearchService.$inject = ['RankingService', 'AttractionService', '$http'];
function SearchService(RankingService, AttractionService, $http) {
  return {
    Init: function(request) {
      // on init assign reuable variable and return result from search
      return this.Search(request);
    },
    Rank: function(request, attraction) {

        return RankingService.Init(request, attraction);
      // rank attraction using the ranking service and return
    },
    Search: function(attraction) {
      // get search results and produce request variables to re-rank each attraction
      $http.get().then(function(response) {
        if(response.status == 200) {

          var results = response.data;
          var attractions = [];

          for (var i = 0; i < results.length; i++) {
            //processAttraction
            var attraction = AttractionService.Process(results[i]);
            var request = {};

            var rank = this.Rank(request, attraction);

            attraction.rank.previous = rank.previous;
            attraction.rank.current = rank.current;

            attractions.push(attraction);
          }
          return attractions;
        }
      });
    }
  };
};
