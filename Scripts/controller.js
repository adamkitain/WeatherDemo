
angular.module('app', [])
  .controller('MainCtrl', ['$scope',
    function($scope) {
      $scope.kmlLayers = {
        wind: false
      };

      var mapWindow = {
        longleft: -110, longright: -80,
        latupper: 41, latlower: 23
      };

      $scope.kmlThreshs = {
        wind: 5
      }

      var kmls = {};

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.82, lng: -96.73},
        zoom: 7
      });

      $scope.map.addListener('bounds_changed', setLayers);

      function setLayers() {
        console.log($scope.map.getBounds());
      }

      var windLayer = new google.maps.KmlLayer({
        url: "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&comparison=greaterthan&threshold="+$scope.kmlThreshs.wind+"&type=shape&lonleft=" + mapWindow.longleft + "&lonright=" + mapWindow.longright + "&latupper="+mapWindow.latupper+"&latlower="+mapWindow.latlower+"&var=WindSpeed_10m&time=now&polycolor=0:153:0:100&linecolor=50:200:50:0",
        map: null,
        preserveViewport: true
      });

      $scope.changeLayerThresh = function (layer) {
        windLayer.setMap(null);
        windLayer.url = "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&comparison=greaterthan&threshold="+$scope.kmlThreshs.wind+"&type=shape&lonleft=" + mapWindow.longleft + "&lonright=" + mapWindow.longright + "&latupper="+mapWindow.latupper+"&latlower="+mapWindow.latlower+"&var=WindSpeed_10m&time=now&polycolor=0:153:0:100&linecolor=50:200:50:0";
        if($scope.kmlLayers.wind) { windLayer.setMap($scope.map);}
      }

      $scope.toggleLayer = function(layer) {
        $scope.kmlLayers[layer] = !$scope.kmlLayers[layer];
        if($scope.kmlLayers.wind) {
          windLayer.setMap($scope.map);
        } else {
          windLayer.setMap(null);
        }
      };
      
    }
  ])

.factory('myFactory', [
  function() {

  }
]);

