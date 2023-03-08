import { googleMap, streetView } from "./google_map_init.js";
import * as util from "./util.js";

let mit_locations = null;
fetch("./mit_locations.json")
	.then(response => response.json())
	.then(data => { mit_locations = data; });


/**
 * Return distance, in meters, to a place given the current Street View position.
 *
 * @param pos { lng: double, lat: double }
 * @return Distance as a double
*/ 
function distanceTo(pos) {
	let currentPos = streetView.getLocation().latLng;
	let distanceKm = util.getHaversineDist(pos.lat, pos.lng, currentPos.lat(), currentPos.lng());

	return distanceKm * 1000;
}


function updateDistanceText() {
	let distanceText = document.getElementById("distance");
	distanceText.innerText = "Current Distance from Killian Court is " + Math.round(distanceTo(mit_locations.killian_court)) + " meters";
}


document.getElementById("distButton").addEventListener("click", updateDistanceText);

let debugButton = document.getElementById("infoButton");
debugButton.addEventListener("click", function() {
	let debugText = document.getElementById("debugText");
	let orbitalPov = streetView.getPov();
	debugText.innerText = "Current Heading: " + orbitalPov.heading + " Current Pitch: " + orbitalPov.pitch;
});
