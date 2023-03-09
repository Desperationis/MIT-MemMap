import { googleMap, streetView } from "./google_map_init.js";
import * as util from "./util.js";

let mit_locations = null;
fetch("./mit_locations.json")
	.then(response => response.json())
	.then(data => { mit_locations = data; onInit(); });


/**
 * Return distance, in meters, to a place relative the current Street View position.
 *
 * @param pos { lng: double, lat: double }
 * @return Distance as a double
*/ 
function distanceTo(pos) {
	let currentPos = streetView.getLocation().latLng;
	let distanceKm = util.getHaversineDist(pos.lat, pos.lng, currentPos.lat(), currentPos.lng());

	return distanceKm * 1000;
}

/**
 * Warp map and street view to the starting position.
*/ 
function warpToSpawn() {
	let spawnPoint = mit_locations.spawn_point;
	googleMap.setCenter(spawnPoint);
	streetView.setPosition(spawnPoint);
	streetView.setPov({ heading: spawnPoint.heading, pitch: spawnPoint.pitch });
}


/**
 * @return A random location from a subcategory from mit_locations.
*/ 
function getRandomLocation(category) {
	let categoryMap = new Map(Object.entries(mit_locations[category]));
	let keys = Array.from(categoryMap.keys());
	let randomKey = keys[Math.floor(Math.random() * keys.length)];

	let value = mit_locations[category][randomKey];

	return { name: randomKey, value: value };
}


/**
 * Control visibility of the google map.
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



let targetLocationMarker = null;

function onInit() {
	const targetLocationText = document.getElementById("targetLocation");
	const submitText = document.getElementById("submitText");
	const checkButton = document.getElementById("checkButton");
	const revealButton = document.getElementById("revealButton");
	const resetButton = document.getElementById("resetButton");

	let targetLocation = null;

	// Hide Google Map so user doesn't cheat
	function chooseNewLocation() {
		warpToSpawn();
		setMapVisibility(false);
		targetLocation = getRandomLocation("halls");
		targetLocationText.innerText = "Your target location is: " + targetLocation.name;
		submitText.innerText = "";
	}
	chooseNewLocation();

	checkButton.addEventListener("click", function() {
		let distance = Math.round(distanceTo(targetLocation.value));
		if (distance <= 100) {
			setMapVisibility(true);

			googleMap.setZoom(18);
			googleMap.setCenter(targetLocation.value);
			submitText.innerText = "Congrats! You are " + distance + " meters away from " + targetLocation.name;
		}
		else {
			submitText.innerText = "Unfortunately, you were " + distance + " meters away from " + targetLocation.name + ". Try again!";
			warpToSpawn();
		}
	});

	revealButton.addEventListener("click", function() {
		setMapVisibility(true);

		targetLocationMarker = new google.maps.Marker({ position: targetLocation.value });
		targetLocationMarker.setMap(googleMap);
		googleMap.panTo(targetLocation.value);

		//googleMap.setZoom(18);
		submitText.innerText = "Here is the location of: " + targetLocation.name;
	});
	
	resetButton.addEventListener("click", function() {
		chooseNewLocation();
	});
}


