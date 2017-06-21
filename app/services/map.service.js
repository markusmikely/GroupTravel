MapService.$inject = ['$cookies', '$rootScope', '$http', 'NgMap'];
function MapService($cookies, $rootScope, $http, NgMap) {
  return {
    Map : 'foo',
    LoadHomeMap: function(dynMarkers, markerClusterer) {
      dynMarkers = [];

      NgMap.getMap().then(function(map) {
        var bounds = new google.maps.LatLngBounds();
        for (var k in map.customMarkers) {
          var cm = map.customMarkers[k];
          dynMarkers.push(cm);
          bounds.extend(cm.getPosition());
        };

        markerClusterer = new MarkerClusterer(map, dynMarkers, {
          styles: [{
              url: 'assets/images/m1.png',
              height: 53,
              width: 53,
              anchor: [26, 26],
              textColor: '#000',
              textSize: 11
          }, {
              url: 'assets/images/m2.png',
              height: 56,
              width: 56,
              anchor: [28, 28],
              textColor: '#000',
              textSize: 11
          }, {
              url: 'assets/images/m3.png',
              height: 66,
              width: 66,
              anchor: [33, 33],
              textColor: '#000',
              textSize: 11
          }, {
              url: 'assets/images/m4.png',
              height: 78,
              width: 78,
              anchor: [39, 39],
              textColor: '#000',
              textSize: 11
          }, {
              url: 'assets/images/m5.png',
              height: 90,
              width: 90,
              anchor: [45, 45],
              textColor: '#000',
              textSize: 11
          }]
        });
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
     });
    },
    LoadSearchMap: function(vmap) {
      return NgMap.getMap();
    },
    LoadAttractionMap: function() {

    },
    ShowDetail:function() {

    },
    HideDetail: function() {

    }
  };
};
