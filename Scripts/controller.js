
angular.module('app', [])
  .controller('MainCtrl', ['$scope',
    function($scope) {
      $scope.kmlLayers = {
        wind: false
      };

      var mapWindow = {
        longleft: -110, longright: -80,
        latupper: 41, latlower: 23,
        levelofdetail: 0.1
      };

      $scope.kmlThreshs = {
        wind: 5
      }

      var kmls = {};

      $scope.time = {
        now: new Date(),
        position: 0,
        queryTime: null,
        queryString: ""
      };
      $scope.time.queryTime = $scope.time.now;
      $scope.time.queryString = $scope.time.queryTime.toISOString().substr(0,$scope.time.queryTime.toISOString().length - 5);

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.82, lng: -96.73},
        zoom: 11,
        maxZoom: 14
      });

      $scope.map.addListener('idle', setLayers);

      function setLayers() {
        var bounds = $scope.map.getBounds();
        mapWindow.longleft = bounds.Ea.j-0.5;
        mapWindow.longright = bounds.Ea.G+0.5;
        mapWindow.latupper = bounds.Ja.j+0.5;
        mapWindow.latlower = bounds.Ja.G-0.5;
        mapWindow.levelofdetail = Math.abs(mapWindow.longleft-mapWindow.longright)/800;
        console.log(mapWindow.levelofdetail);

        windLayer.url = getURL();
        windLayer.setMap(null);
        if($scope.kmlLayers.wind) {windLayer.setMap($scope.map) };
      }

      

      var windLayer = new google.maps.KmlLayer({
        url: getURL(),
        map: null,
        preserveViewport: true
      });

      $scope.drawLayer = function () {
        windLayer.setMap(null);
        windLayer.url = getURL();
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

      $scope.updateTime = function () {
        var addTime = $scope.time.position*60*1000;
        $scope.time.queryTime.setTime($scope.time.now.getTime() + addTime);
        $scope.time.queryString = $scope.time.queryTime.toISOString().substr(0,$scope.time.queryTime.toISOString().length - 5);
        $scope.drawLayer();
      }

      function getURL() {
        return "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&comparison=greaterthan&threshold="+$scope.kmlThreshs.wind+"&type=shape&lonleft=" + mapWindow.longleft + "&lonright=" + mapWindow.longright + "&latupper="+mapWindow.latupper+"&latlower="+mapWindow.latlower+"&var=WindSpeed_10m&time="+$scope.time.queryString+"&polycolor=0:153:0:100&linecolor=50:200:50:0&levelofdetail="+mapWindow.levelofdetail;
      }
      
    }
  ])

.factory('myFactory', [
  function() {

  }
]);

