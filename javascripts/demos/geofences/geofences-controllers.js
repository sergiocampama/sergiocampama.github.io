function GeofencesToolController($scope) {
  $scope.geofences = [];
  var count = 0;

  var add_geofence = function(geofence_path, polyline) {
    count++;

    var geofence = new google.maps.Polygon({
      id: count,
      name: "Geofence " + count,
      map: map,
      strokeOpacity: 0.9,
      strokeColor: '#3A87AD',
      strokeWeight: 1,
      fillColor: '#3A87AD',
      fillOpacity: 0.3,
      paths: geofence_path,
      polyline: polyline,
      area: google.maps.geometry.spherical.computeArea(geofence_path)/1000000
    });

    $scope.geofences.push(geofence);

    google.maps.event.addListener(geofence, 'click', function(){
      this.setEditable(!this.getEditable());
      this.setDraggable(this.getEditable());
    });

    var polygon_path = geofence.getPath();

    var refresh_geofence = function(path){
      geofence.set("polyline", google.maps.geometry.encoding.encodePath(path));
      geofence.set("area", google.maps.geometry.spherical.computeArea(path)/1000000);
      update_local_store();
      $scope.$apply();
    }

    google.maps.event.addListener(polygon_path, 'set_at', function (event) {
      refresh_geofence(this);
    });

    google.maps.event.addListener(polygon_path, 'insert_at', function (event) {
      refresh_geofence(this);
    });

    update_local_store();

    return geofence;
  }

  $scope.create_geofence = function(){

    var show_help = function(){
      var popover = $(".navbar").popover({
        title: "Help",
        placement: "bottom",
        content: "To edit the geofence on the map, click on it. To disable editing, click on it again."
      }).popover("show");

      setTimeout(function(){
        popover.popover("hide");
      }, 10000);
    }

    if (!localStorage.getItem("help_shown")) {
      show_help();
      localStorage.setItem("help_shown", true);
    }
    
    var center = map.getCenter();
    /* trial and error, nothing fancy */
    var relative_distance = (1 * 10000000)/(Math.pow(2,map.getZoom()));

    var heading, geofence_path = [];
    /* four corners */
    for (heading = 45; heading < 360; heading += 90) {
      var corner = google.maps.geometry.spherical.computeOffset(center, relative_distance, heading);
      geofence_path.push(corner);
    }

    var polyline = google.maps.geometry.encoding.encodePath(geofence_path);

    add_geofence(geofence_path, polyline);
  }

  $scope.restore_geofence = function(){
    bootbox.prompt("Enter polyline", function(text){
      if (!!text) {
        var polyline = text;
        var geofence_path = google.maps.geometry.encoding.decodePath(text);
        var geofence = add_geofence(geofence_path, polyline);
        $scope.$apply();
        $scope.show_geofence(geofence);
      }
    });
  }

  $scope.show_geofence = function(geofence) {
    var geofence_path = google.maps.geometry.encoding.decodePath(geofence.get("polyline"));
    var bounds = new google.maps.LatLngBounds();
    $.each(geofence_path, function(i, point){
      bounds.extend(point);
    });
    map.fitBounds(bounds);
  }

  $scope.remove_geofence = function(geofence) {
    $scope.geofences = $scope.geofences.filter(function(array_geofence) {
      if (array_geofence.id == geofence.id) {
        geofence.setMap(null);
        return false;
      } else {
        return true;
      }
    });
    update_local_store();
  }

  $scope.show_points = function(geofence) {
    var geofence_path = google.maps.geometry.encoding.decodePath(geofence.get("polyline"));
    $scope.modal_header = "Points for: " + geofence.name;
    $scope.modal_points = geofence_path;
    $("#points_modal").modal("show");
  }

  $scope.$on('setup_view', function(ngRepeatFinishedEvent) {
    $("[data-toggle='tooltip']").tooltip();
  });

  var update_local_store = function() {
    var polylines_array = [];
    $.each($scope.geofences, function(i, geofence){
      polylines_array.push(geofence.get("polyline"));
    })
    localStorage.setItem("geofences", JSON.stringify(polylines_array));
  }

  var map_options = {
    center: new google.maps.LatLng(-33.4795, -70.6368),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  google.maps.visualRefresh = true;
  
  var map = new google.maps.Map(document.getElementById("map"), map_options);
  var storage_geofences = localStorage.getItem("geofences");
  if (!!storage_geofences) {
    var polylines_array = JSON.parse(storage_geofences);
    $.each(polylines_array, function(i, polyline){
      var geofence_path = google.maps.geometry.encoding.decodePath(polyline);
      add_geofence(geofence_path, polyline);
    });
  }

  $("[data-toggle='tooltip']").tooltip();
  
}
