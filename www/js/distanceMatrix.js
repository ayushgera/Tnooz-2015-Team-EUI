function initMap(){
	// uncomment following and comment next to show current location 
	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//getData();
	
	initMainMap(new google.maps.LatLng(48.8582,2.2945));
}

function onSuccess(position){
	var myLatLng= new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	initMainMap(myLatLng);
}

function initMainMap(myLatLng){
	var mapOptions={
		center: myLatLng,
		zoom:16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	//uncomment to show marker on current location
	/*var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'You Are Here'
	});*/

	var bounds = new google.maps.LatLngBounds();
	var new_markers=[];
	var marker_length=0;
	var locationsArray= data;
	for(var i=0;i<locationsArray.length;i++){
		var latLng= new google.maps.LatLng(locationsArray[i].latitude,locationsArray[i].longitude);
		bounds.extend(latLng);
		new_markers[marker_length++] = new google.maps.Marker({
			position: latLng,
			map: map,
			title: locationsArray[i].name
		});
	}
	map.fitBounds(bounds);
	getZoomByBounds(map,bounds);
}

function onError(){
	alert("map not loaded");
}

/**
* Returns the zoom level at which the given rectangular region fits in the map view. 
* The zoom level is computed for the currently selected map type. 
* @param {google.maps.Map} map
* @param {google.maps.LatLngBounds} bounds 
* @return {Number} zoom level
**/

function MProjection() {
}
MProjection.prototype.fromLatLngToPoint = function(latlng) {
    var x = (latlng.lng() + 180) / 360 * 256;
    var y = ((1 - Math.log(Math.tan(latlng.lat() * Math.PI / 180) + 1 / Math.cos(latlng.lat() * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 0)) * 256;
    return new google.maps.Point(x, y);
};

function getZoomByBounds( map, bounds ){
	var MAX_ZOOM =  map.getMapTypeId().maxZoom || 21 ;
	var MIN_ZOOM =  map.getMapTypeId().minZoom || 0 ;


	// Wait for idle map
	//google.maps.event.addListener(map, 'idle', function() {
	   // Get projection
	  // projection = overlay.getProjection();
	   
	var ne= new MProjection().fromLatLngToPoint( bounds.getNorthEast() );
	var sw= new MProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

	  var worldCoordWidth = Math.abs(ne.x-sw.x);
	  var worldCoordHeight = Math.abs(ne.y-sw.y);

	  //Fit padding in pixels 
	  var FIT_PAD = 40;

	  for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
		  if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() && 
			  worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() )
			  return zoom;
	  }
	   
	//})

	return 0;
}
