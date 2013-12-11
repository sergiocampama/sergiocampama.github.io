$(function(){
  var map_element = document.getElementById('map');
  var map_options = {
    scrollwheel: false,
    zoom: 9,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(-33.471835, -70.647179),
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.DEFAULT,
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
  };
  var map = new google.maps.Map(map_element, map_options);
});