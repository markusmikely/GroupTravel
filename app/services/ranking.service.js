RankingService.$inject = [];
function RankingService() {
  return {
    Init: function(request, attraction) {

      this.request = request;
      this.attraction = attraction;
      this.response = {};
      return this.Rank();
    },
    Rank: function() {
      this.response = {
        'previous': this.PreviousUserRank(),
        'current': this.CurrentUserRank(),
      };
      return this.response;
    },
    PreviousUserRank: function(attraction) {

      var matches =  this.array_intersect(this.request.previous_experiences, this.attraction.experiences).length;
      var previous_rank = matches * 0.25;

      return previous_rank;
    },
    CurrentUserRank($index) {
      var current = this.ExactMatch(this.request.experiences);

      return current;
    },
    ExactMatch: function(experiences) {

      var matches =  this.array_intersect(experiences, this.attraction.experiences).length;
      var notInAttraction = this.array_diff(this.array_intersect(experiences, this.attraction.experiences), experiences).length;
      var notInRequest  = this.array_diff(this.array_intersect(experiences, this.attraction.experiences), this.attraction.experiences).length;
      var exactMatchScore = ((matches * 3) - (notInAttraction) - (notInRequest * 2));
      return exactMatchScore;

    },
    array_diff: function(a1, a2) {
      var a = [], diff = [];
      for (var i = 0; i < a1.length; i++) {
          a[a1[i]] = true;
      }
      for (var i = 0; i < a2.length; i++) {
          if (a[a2[i]]) {
              delete a[a2[i]];
          } else {
              a[a2[i]] = true;
          }
      }
      for (var k in a) {
          diff.push(k);
      }
      return diff;
    },
    array_intersect: function(a, b) {
      var t;
      if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
      return a.filter(function (e) {
          return b.indexOf(e) > -1;
      });
    },
    calculateAge: function(date) {
      var ageDifMs = Date.now() - date.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

  };
};
