//var inputToAlgorithm=[];
/**
 * Structure of the input
 * INPUTS.inputToAlgorithm[4][5] = {fromPlaceId, toPlaceId, distance, duration}
 * origin= 4, destination =5 --> use placeIdMap variable to map this id with actual place ID i.e placeIdMap["ChIJazhtdOxv5kcRqV9clsepEIc"]= 4
 * for example: INPUTS.inputToAlgorithm[placeIdMap["ChIJazhtdOxv5kcRqV9clsepEIc"]][placeIdMap["ChIJ1fXA1ERu5kcRcIbgA4VK1H0"]] = {distance: 2134, duration: 23}
 **/
var INPUTS={};
INPUTS.inputToAlgorithm=[]; //contains 2D array to be provided as input to the main algorithm
INPUTS.size=0; // size of the 2d array
/**
 * Function to generate all distances between all places which is input to the main algorithm.
 * This also calls the main algorithm.
 **/
function distanceCalculator(data){
	var queryStrings=[];
	var numDecaSets=Math.floor(data.length/10); //number of groups of 10
	var remainderCount=data.length%10; //number of remaining elements outside of decasets
	var numCallbacks=0;
	for(;numCallbacks<numDecaSets;numCallbacks++){
		var queryString="";
		for(var j=0;j<10;j++){
			queryString+=data[10*numCallbacks+j].latitude+","+data[10*numCallbacks+j].longitude;
			if(j!=9){
				queryString+="|";
			}
		}
		queryStrings[numCallbacks]=queryString;
	}
	if(remainderCount>0){
		var queryString="";
		for(var k=0;k<remainderCount;k++){
			queryString+=data[10*numDecaSets+k].latitude+","+data[10*numDecaSets+k].longitude;
			if(k!=remainderCount-1){
				queryString+="|";
			}
		}
		queryStrings[numCallbacks]=queryString;
		numCallbacks++;
	}
	var requests=[];
	for(var i=0;i<numCallbacks;i++){
		requests.push($.ajax({url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+queryStrings[i]+"&destinations="+queryStrings[i]+"&key=AIzaSyB8fWpP5-N1Eeve4EWIzGKtCOiyifEBtBg", success: function(result){
		}}));
	}
	//deferred callbacks
	$.when.apply($,requests).done(
		function(){
		/**
		 * Structure of the input
		 * INPUTS.inputToAlgorithm[4][5] = {fromPlaceId, toPlaceId, distance, duration}
		 * origin= 4, destination =5 --> use placeIdMap variable to map this id with actual place ID i.e placeIdMap[4]= "ChIJazhtdOxv5kcRqV9clsepEIc"
		 **/
		//inputToAlgorithm=result.rows;
		
		var x=0;
		for(var i=0;i<arguments.length;i++){
			generateInput(arguments[0].rows);
		}
		
		/**
		 ******************************************************************************************
		 * TODO: Call Sathya's Algorithm, use "INPUTS.inputToAlgorithm" as input, the structure is defined above
		 ******************************************************************************************
		 **/
		 
		/**
		 ****************************************************************************************** 
		 * TODO: Output of Sathya's algorithm loads the images on the main page. The code comes here (call a function) 
		 ******************************************************************************************
		 **/
	
		});
}

function generateInput(distanceArray){
	for(var i=0;i<distanceArray.length;i++){
		//i --> from city
		var destinations= distanceArray[i].elements;
		INPUTS.inputToAlgorithm[INPUTS.size]=[];
		for(var j=0;j<destinations.length;j++){
			var inputObject={};
			inputObject.fromPlaceId=data[i].placeId;
			inputObject.toPlaceId=data[j].placeId;
			inputObject.distance= destinations[j].distance.value;
			inputObject.duration= destinations[j].duration.value;
			//inputToAlgorithm.push(inputObject);
			INPUTS.inputToAlgorithm[INPUTS.size].push(inputObject);
		}
		INPUTS.size++;
	}
}
/**
 * To be used in description page,
 * Will give best possible routes to the selected place from the current location, and display on a map
 * @params: locObject: conatins begin and end locations lat and long
 **/
function calculateDistanceMatrix(locObject){
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	
	var mapOptions={
		center: new google.maps.LatLng(locObject.beginLat,locObject.beginLong),
		zoom:16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	directionsDisplay.setMap(map);
	var orig= new google.maps.LatLng(locObject.beginLat,locObject.beginLong);
	var dest= new google.maps.LatLng(locObject.endLat,locObject.endLong);
	calculateAndDisplayRoute(directionsService, directionsDisplay, orig, dest);
}

/**
 * Helper function for the calculateDistanceMatrix
 **/
function calculateAndDisplayRoute(directionsService, directionsDisplay,  orig, dest) {
	directionsService.route({
		origin: orig,
		destination: dest,
		travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(response);
		} else {
		  window.alert('Directions request failed due to ' + status);
		}
	});

	distanceMatrixMain(orig, dest);
}

/**
 * Helper function for the calculateAndDisplayRoute, contains parsing logic for distance matrix api
 **/
function distanceMatrixMain(orig, dest){
var service = new google.maps.DistanceMatrixService;
	service.getDistanceMatrix({
		origins: [orig],
		destinations: [dest],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false
	},function(response, status) {
	if (status !== google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {
		var originList = response.originAddresses;
		var destinationList = response.destinationAddresses;
		var outputDiv = document.getElementById('timeContainer');
		outputDiv.innerHTML = "<div>";

		for (var i = 0; i < originList.length; i++) {
		var results = response.rows[i].elements;

			for (var j = 0; j < results.length; j++) {
				//trafficTime= results[j].duration.value*100;
				//outputDiv.innerHTML += "<span style='display:block;'>Distance Remaining: <font size='6em' style='bold'>"+results[j].distance.text+"</font></span> <span //style='display:block;'>Expected Time of travel: <font size='6em' style='bold'>" +
				//results[j].duration.text + '</font></span><br>';
			}
		}
		outputDiv.innerHTML+="</div>";
	}
});
		

}

/**
 * Main Entry Point. First it calls distanceCalculator, which generates the input for the main algorithm and then calls executes the algorithm
 * Meanwhile, it would also load the map, and update all markers to all the places, for the main page
 **/
function initApp(){
	//uncomment following and comment next to show current location 
	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//getData();
	distanceCalculator(data);
	initMainMap(new google.maps.LatLng(48.8582,2.2945));
}

/**
 * callback to navigator, for success, used only when displaying current location, which is currently commented as not needed
 **/
function onSuccess(position){
	var myLatLng= new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	initMainMap(myLatLng);
}

/**
 * callback to navigator, in case of error, used only when displaying current location, which is currently commented as not needed
 **/
function onError(){
	alert("map not loaded");
}

/**
 * initialises the map on the main page with markers to all places
 **/
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
