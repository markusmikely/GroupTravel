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
      var previous_rank = this.ExactMatch(this.request.previous_experiences);
      // Add decay here after one year
      var date = new Date(this.attraction.updated);
      var age = calculateAge(date);
      if(age >= 1) {
         previous_rank = this.response.previous_rank * exp(-2*age*age);
      }
      return previous_rank;
    },
    CurrentUserRank($index) {
      return this.ExactMatch(this.request.experiences);
    },
    ExactMatch: function(experiences) {
      var matches =  this.array_intersect(experiences, this.attraction.experiences).length * 500;
      var notInAttraction = this.array_diff(this.array_intersect(experiences, this.attraction.experiences), this.attraction.experiences).length*(-100);
      var notInRequest  = this.array_diff(this.array_intersect(experiences, this.attraction.experiences), experiences).length*(-200);
      var exactMatchScore = (matches + notInAttraction + notInRequest);
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
    array_intersect: function(a, arrbay2) {
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
