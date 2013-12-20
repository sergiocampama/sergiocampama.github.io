function CustomLabel(options){
  this.setValues(options);
  var div = this.div_ = document.createElement('div');
  div.className = 'trackable_label_container';
  var text_div = this.inner_text_div_ = document.createElement('div');
  text_div.className = 'trackable_label';
  div.appendChild(text_div);
  div.style.cssText = 'line-height: 21px; position: absolute; display: none;'
  if (this.get("color") !== undefined) {
    text_div.style.color = this.get("color");
  }
}

CustomLabel.prototype = new google.maps.OverlayView;

CustomLabel.prototype.onAdd = function() {
  var pane = this.getPanes().overlayImage.appendChild(this.div_);
  var that = this;
  var text_div = this.inner_text_div_;
  this.listeners_ = [
    google.maps.event.addListener(this, 'position_changed', function() { that.draw(); }),
    google.maps.event.addListener(this, 'text_changed', function() { that.draw(); }),
    google.maps.event.addListener(this, 'active_changed', function() { that.draw(); }),
    google.maps.event.addListener(this, 'visible_changed', function() { that.draw(); }),
    google.maps.event.addListener(this, 'zIndex_changed', function() { that.draw(); })
  ];
}

CustomLabel.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  for (var i = this.listeners_.length - 1; i >= 0; i--) {
    google.maps.event.removeListener(this.listeners_[i]);
  };
}

CustomLabel.prototype.draw = function() {
  var projection = this.getProjection();
  var position = projection.fromLatLngToDivPixel(this.get('position'));

  var div  = this.div_;
  div.style.left = Math.round(position.x) + 37 + 'px';
  div.style.top = Math.round(position.y) - 6 + 'px';
  div.style.display = 'block';
  div.style.zIndex = this.get('zIndex');

  this.inner_text_div_.innerHTML = this.get('text').toString();
  this.inner_text_div_.className = 'trackable_label';
  if(this.get('active')){
    this.inner_text_div_.className += ' active';  
  }
  if(!(this.get('visible') !== false)){
    div.style.display = 'none';
  }
  
}
