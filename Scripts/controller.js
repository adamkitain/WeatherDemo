
angular.module('app', [])
  .controller('MainCtrl', ['$scope',
    function($scope) {
      $scope.kmlLayers = {
        wind: false
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
        now: new Date(2015, 9, 21, 0,0,0,0),
        position: 5,
        queryTime: null,
        queryString: ""
      };
      $scope.time.queryTime = $scope.time.now;
      $scope.time.queryString = $scope.time.queryTime.toISOString().substr(0,$scope.time.queryTime.toISOString().length - 5);

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.11, lng: -77.68},
        zoom: 9,
        maxZoom: 14
      });

      var schoolList = [
        {lat: 38, lng: -75.5, img: 'images/school2.png'},
        {lat: 39, lng: -78, img: 'images/school2.png'},
        {lat: 37.8, lng: -75, img: 'images/school2.png'},
        {lat: 38.7, lng: -74, img: 'images/school2.png'},
        {lat: 39.2, lng: -73, img: 'images/school2.png'},
        {lat: 39.6, lng: -78, img: 'images/school2.png'},
        {lat: 38.3, lng: -79, img: 'images/school2.png'},
        {lat: 40.1, lng: -78.5, img: 'images/school2.png'},
        {lat: 37.3, lng: -74.8, img: 'images/school2.png'},
        {lat: 38.7, lng: -78, img: 'images/school2.png'},
        {lat: 40.3, lng: -79.2, img: 'images/school2.png'},
        {lat: 38.1, lng: -76, img: 'images/school2.png'}
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

      //$scope.map.addListener('idle', setLayers);

      var layers = new Array(4);
      for (var i = 0; i < 4; i++){
        layers[i] = new Array(24);
      }

      for (var i=0; i < 4; i++) {
        for (var j=0; j < 24; j++) {
          layers[i][j] = new google.maps.KmlLayer({
            url: "https://sites.google.com/site/weatherdemo135/kml-files/rain_time_"+j+"_thresh_"+i+".kml",
            map: null,
            preserveViewport: true
          });
        }
      }

      drawMarkers();

      function setLayers() {
        console.log("position: ", $scope.time.position);
        for(var i = 0; i < 4; i++){
          for (var j = 0; j < 24; j++) {
            layers[i][j].setMap(null);
          }
        }
        if($scope.kmlLayers.wind) {
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
        setLayers();
      }

      function getURL() {
        return "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&comparison=greaterthan&threshold="+$scope.kmlThreshs.wind+"&type=shape&lonleft=" + mapWindow.longleft + "&lonright=" + mapWindow.longright + "&latupper="+mapWindow.latupper+"&latlower="+mapWindow.latlower+"&var=accumraintotal&time="+$scope.time.queryString+"&polycolor=0:153:0:100&linecolor=50:200:50:0&levelofdetail="+mapWindow.levelofdetail;
      }

      $scope.streamPlay = function (weather) {
	    console.log("success!");
	    // SC.stream(stream_url, function(sound){
	    //   $scope.weather = weather;
	    //   // weather.play();
	    // });

	    $scope.isStreaming = true;
	}

		$scope.streamPause = function (weather) {
	    // weather.pause()
	    console.log("success!")

	    $scope.isStreaming = false;
	}
      
    }
  ])

.factory('myFactory', [
  function() {

  }
]);

