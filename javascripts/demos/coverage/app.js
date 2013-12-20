$(function(){
  var map_options = {
    center: new google.maps.LatLng(-33.4795, -70.6368),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  
  google.maps.visualRefresh = true;
  
  var map = new google.maps.Map(document.getElementById("map"), map_options);

  var polylines = [
    ["05-06-2013","vdicFbmh}L{Ag@iBWQ|BlHlAnBOZEeBkA"],
    ["06-06-2013","neicFdmh}LoEuAKf@xAx@dFhDn@C~@Ip@m@eBw@"],
    ["07-06-2013","jxicFxdh}LcGiJ}BvIsAzC}K`@HtCdFnAnJdB@yEpA_D"],
    ["08-06-2013","dxicFrdh}LqBwDIMkChAmAr@qCfByC~@uFpAIzAvDbAnJTv@o@tFcG"],
    ["09-06-2013","`|icFz|g}LCK_BtAe@pCkAq@q@J[FnB~@w@FaBHk@dBc@nCRGVId@wBlDsAf@i@lBiF"],
    ["10-06-2013","jyhcFteh}L}@kAs@y@Da@S_@g@COvB|@~A|@l@Ni@"],
    ["11-06-2013","xwhcFjch}LYaBIo@cA[EtDy~@rr@OrBzBl@J{@uBcBjMwJjp@_g@lAbB"],
    ["12-06-2013","l{hcFzeh}L_AHGYk@J{@OIeCICWr@FTOzA{l@pR??cPl^W?@n@~AZNQwAy@`Pm^uClf@AJNv@?NHJVPGu@[{@I?rCmf@zl@qRl@|BnDyB"],
    ["13-06-2013","f~hcF`mh}L?k@gB}DoDwDk@`Bj@pBcAdBIjAp@x@hAq@fBsB"],
    ["14-06-2013","tyhcFlbh}L`BGx@_@j@q@G}@Aq@a@cA_DhB{@m@iB|Am@dBVpAxAjAv@Mj@_@Do@eAeA"],
    ["15-06-2013","dxicFtch}LcFyCe@~EgO{EHoAoGh@y@jAd@z@fEUnAiAxNrEc@zAw@jAZApA[dF}B`@q@"]
  ];

  var map_polylines = [];

  var add_geofence = function(polyline) {
    var path = google.maps.geometry.encoding.decodePath(polyline[1]);
    var polygon = new google.maps.Polygon({
      name: polyline[0],
      map: map,
      strokeOpacity: 0.9,
      strokeColor: '#3A87AD',
      strokeWeight: 1,
      fillColor: '#3A87AD',
      fillOpacity: 0.3,
      paths: path
    });


    var area = google.maps.geometry.spherical.computeArea(path)/1000000;
    area = ('' + area).match(/\d*\.\d{3}/)[0];
    
    var label = new CustomLabel({map: map});
    label.set('text', polyline[0] + "<br/>" + area + " km2");
    label.set('visible', false);
    label.set('position', new google.maps.LatLng(0,0));
    label.set('active', true);

    google.maps.event.addListener(polygon, 'mousemove', function(ev){
      label.set('visible', true);
      label.set('position', ev.latLng);
    });

    google.maps.event.addListener(polygon, 'mouseout', function(ev){
      label.set('visible', false);
    });


    map_polylines.push(polygon);

    
  }

  var remove_geofence = function() {
    map_polylines[map_polylines.length - 1].setMap(null);
    map_polylines.pop();
  }

  var refit = function() {
    var latLngBounds = new google.maps.LatLngBounds();


    $.each(map_polylines, function(i, polygon){
      $.each(polygon.getPath().getArray(), function(j, coordinate){
        latLngBounds.extend(coordinate);
      });
    });

    map.fitBounds(latLngBounds);
  }

  var actual_index = 0;
  $("#current_date").html(polylines[actual_index][0]);
  add_geofence(polylines[actual_index]);
  refit();

  var go_forward = function() {
    add_geofence(polylines[actual_index]);
    refit();
  };

  var go_back = function() {
    remove_geofence();
    refit();
  };

  $("#next_day_button").click(function(){
    console.log("next");
    if (actual_index < polylines.length - 1) {
      actual_index++;
      $("#current_date").html(polylines[actual_index][0]);
      go_forward();
    }
  });

  $("#prev_day_button").click(function(){
    console.log("prev");
    if (actual_index > 0) {
      actual_index--;
      $("#current_date").html(polylines[actual_index][0]);
      go_back();
    }
  });
});