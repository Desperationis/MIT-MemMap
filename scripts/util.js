


/**
 * Control visibility of the google map regardless of its state.
 *
 * @param visible Boolean
*/ 
function setMapVisibility(visible) {
	let googleMapDiv = document.getElementById("map");

	if (visible)
		googleMapDiv.style.display = "block";
	else
		googleMapDiv.style.display = "none";
}


/**
 * Warp map and street view to the starting position.
 *
 * @param googleMap Google Map object
 * @param streetView Street View object
 * @param pose { lat: double, lng: double, heading: double, pitch: double }
*/ 
function warpTo(googleMap, streetView, pose) {
	let pos = { lat: pose.lat, lng: pose.lng };
	let pov = { heading: pose.heading, pitch: pose.pitch };

	googleMap.setCenter(pos);
	streetView.setPosition(pos);
	streetView.setPov(pov);
}

/**
 * Return distance, in meters, to a place relative the current Street View position.
 *
 * @param streetView Street View object
 * @param pos { lng: double, lat: double }
 *
 * @return Distance in meters
*/ 
function distanceTo(streetView, pos) {
	let currentPos = streetView.getLocation().latLng;
	let distanceKm = getHaversineDist(pos, { lat: currentPos.lat(), lng: currentPos.lng() });

	return distanceKm * 1000;
}




/**
 * @param pos1 { lat: double, lng: double}
 * @param pos2 { lat: double, lng: double}
 * 
 * @returns Distance in km >= 0
*/
function getHaversineDist(pos1, pos2) {
	function toRad(n) {
		return n * (Math.PI / 180);
	}

	var R = 6371; // km 
	var x1 = pos2.lat-pos1.lat;
	var dLat = toRad(x1);  
	var x2 = pos2.lng-pos1.lng;
	var dLon = toRad(x2);  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * 
					Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;

	return d; // in km
}

export { getHaversineDist, setMapVisibility, warpTo, distanceTo };
