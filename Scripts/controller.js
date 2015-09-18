
angular.module('app', [])
  .controller('MainCtrl', ['$scope',
    function($scope) {
      $scope.kmlLayers = {
        wind: false,
        snow: false
      };

      var mapWindow = {
        longleft: -94, longright: -60,
        latupper: 47, latlower: 29,
        levelofdetail: 0.1
      };

      $scope.kmlThreshs = {
        wind: 5
      }

      var kmls = {};

      $scope.time = {
        now: new Date(2015, 8, 21, 0, 0, 0, 0),
        position: 0,
        queryTime: new Date(),
        queryString: ""
      };
      $scope.time.queryTime.setTime($scope.time.now.getTime());
      $scope.time.queryString = $scope.time.queryTime.toISOString().substr(0,$scope.time.queryTime.toISOString().length - 5);

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.11, lng: -77.68},
        zoom: 9,
        maxZoom: 14
      });

      var schoolList = [
        {lat: 38.992, lng: -77.531, img: 'images/school2.png'},
        {lat: 39.091, lng: -77.492, img: 'images/school2.png'},
        {lat: 39.128, lng: -77.707, img: 'images/school2.png'},
        {lat: 39.015, lng: -77.515, img: 'images/school2.png'},
        {lat: 38.974, lng: -77.645, img: 'images/school2.png'},
        {lat: 39.123, lng: -77.535, img: 'images/school2.png'},
        {lat: 39.056, lng: -77.409, img: 'images/school2.png'},
        {lat: 39.001, lng: -77.789, img: 'images/school2.png'},
        {lat: 39.110, lng: -77.582, img: 'images/school2.png'},
        {lat: 39.268, lng: -77.636, img: 'images/school2.png'},
        {lat: 39.198, lng: -77.720, img: 'images/school2.png'},
        {lat: 38.912, lng: -77.556, img: 'images/school2.png'},
        {lat: 39.013, lng: -77.401, img: 'images/school2.png'},
        {lat: 39.041, lng: -77.353, img: 'images/school2.png'},
        {lat: 39.212, lng: -77.534, img: 'images/school2.png'},
        {lat: 39.054, lng: -77.478, img: 'images/school2.png'}
      ];

      var markers = [];

      function drawMarkers() {
        console.log(schoolList);
        schoolList.forEach(function(school) {
          markers.push(new google.maps.Marker({
            position: {lat: school.lat, lng: school.lng},
            map: $scope.map,
            icon: {url: school.img}
          }));
        })
      }

      $scope.map.addListener('idle', setLayers);

      var layers = new Array(4);
      for (var i = 0; i < 4; i++){
        layers[i] = new Array(19);
      }

      for (var i=0; i < 4; i++) {
        for (var j=0; j < 19; j++) {
          layers[i][j] = new google.maps.KmlLayer({
            url: "https://sites.google.com/site/weatherdemo135/kml-files/rain_time_"+j+"_thresh_"+i+".kml",
            map: null,
            preserveViewport: true
          });
        }
      }

      drawMarkers();

      function setLayers() {
        //WIND LAYER 
        var bounds = $scope.map.getBounds();
        mapWindow.longleft = bounds.Ga.j-0.5;
        mapWindow.longright = bounds.Ga.H+0.5;
        mapWindow.latupper = bounds.Ka.j+0.5;
        mapWindow.latlower = bounds.Ka.H-0.5;
        mapWindow.levelofdetail = Math.abs(mapWindow.longleft-mapWindow.longright)/800;

        windLayer.url = getURL();
        windLayer.setMap(null);
        if($scope.kmlLayers.wind) {
          console.log("getting here!", getURL());
          windLayer.setMap($scope.map); 
        };

        // SNOW LAYER
        for(var i = 0; i < 4; i++){
          for (var j = 0; j < 19; j++) {
            layers[i][j].setMap(null);
          }
        }
        if($scope.kmlLayers.snow) {
          for(var i = 0; i < 4; i++) {
            layers[i][$scope.time.position].setMap($scope.map);
          }
        } 
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
        // if($scope.kmlLayers.wind) {
        //   windLayer.setMap($scope.map);
        // } else {
        //   windLayer.setMap(null);
        // }
        setLayers();
      };

      $scope.updateTime = function () {
        // var addTime = $scope.time.position*60*1000;
        // $scope.time.queryTime.setTime($scope.time.now.getTime() + addTime);
        // $scope.time.queryString = $scope.time.queryTime.toISOString().substr(0,$scope.time.queryTime.toISOString().length - 5);
        // $scope.drawLayer();
        $scope.time.position = parseInt($scope.time.position);
        console.log($scope.time.position)
        setLayers();
      }

      function getURL() {
        return "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&comparison=greaterthan&threshold="+$scope.kmlThreshs.wind+"&type=shape&lonleft=" + mapWindow.longleft + "&lonright=" + mapWindow.longright + "&latupper="+mapWindow.latupper+"&latlower="+mapWindow.latlower+"&var=WindSpeed_10m&time="+$scope.time.queryString+"&polycolor=0:153:0:100&linecolor=50:200:50:0&levelofdetail="+mapWindow.levelofdetail;
      }

      function timeout(i) {
          setTimeout(function () {
              setLayers();
              $scope.time.position = $scope.time.position + 1;
              console.log(i);
              if ($scope.time.position == 99) {
                return;
              };
              if ($scope.time.position == 19) {
                $scope.time.position = 1
              };
              timeout(i);
          }, 500);
      }

      $scope.streamPlay = function () {
        $scope.time.position = 4
          timeout(i)
	    $scope.isStreaming = true;
	}

		$scope.streamPause = function () {
	    $scope.time.position = 99
	    $scope.isStreaming = false;
	}
      
    }
  ])

.factory('myFactory', [
  function() {

  }
]);

