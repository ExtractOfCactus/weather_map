var MapWrapper = function(container, coords, zoom) {
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });
  this.markers = [];
}

// MapWrapper.prototype.method_name = function(first_argument) {
//   // body...
// };