import { googleMap, streetView } from "./google_map_init.js";
import * as util from "./util.js";

function bootstrapProgram() {
	// Load MIT Locations from JSON
	fetch("./mit_locations.json")
		.then(response => response.json())
		.then(async function(data) { 
			let mit_locations = data; 
			onInit(mit_locations); 
		});

}


function onInit(mit_locations) {
	const targetLocationText = document.getElementById("targetLocation");
	const submitText = document.getElementById("submitText");
	const checkButton = document.getElementById("checkButton");
	const revealButton = document.getElementById("revealButton");
	const newLocButton = document.getElementById("newLocButton");
	
	const randomStartCheckbox = document.querySelector("li .randomizationOption");


	let targetLocation = null;
	let targetLocationMarker = null;

	// Initial setup
	util.setMapVisibility(false);
	submitText.innerText= "Select \"Choose New Location\" to start!";

	util.warpTo(googleMap, streetView, mit_locations.spawn_point);


	/**
	 * Chooses a position from whitelisted categories at random.
	 *
	 * @param whitelist Array of category strings 
	 *
	 * @return { name: name, pos: { lat: double, lng: double } }
	*/ 
	function randomSpot(whitelist) {
		const rootKeys = Object.keys(mit_locations);
		let allLocations = [];

		for(const key of rootKeys) {

			// Categories must have a map of positions
			if(mit_locations[key].lat == null && whitelist.includes(key)) {
				let locations = Object.entries(mit_locations[key]);
				allLocations = allLocations.concat(locations);
			}
		}

		const randomIndex = Math.floor(Math.random() * allLocations.length);

		return { name: allLocations[randomIndex][0], pos: allLocations[randomIndex][1] };
	}

	function randomWhitelistedSpot() {
		let locationOptions = Array.from(document.querySelectorAll("li .locationOption").values());
		locationOptions = locationOptions.filter(loc => loc.checked );
		locationOptions = locationOptions.map(loc => loc.parentNode.innerText.trim());
		return randomSpot(locationOptions);
	}

	newLocButton.addEventListener("click", function() {
		// Warp to random spot, if selected.
		console.log(randomStartCheckbox);
		if (randomStartCheckbox.checked) {
			let randomStartSpot = randomWhitelistedSpot().pos;

			util.warpTo(googleMap, streetView, {
				lat: randomStartSpot.lat,
				lng: randomStartSpot.lng,
				heading: 0,
				pitch: 30
			});
		}
		else {
			util.warpTo(googleMap, streetView, mit_locations.spawn_point);
		}


		// Reset internal state
		util.setMapVisibility(false);
		if(targetLocationMarker != null)
			targetLocationMarker.setMap(null);

		// Only select from categories selected
		targetLocation = randomWhitelistedSpot();

		submitText.innerText = "";
		targetLocationText.innerText = "Find the location of " + targetLocation.name + "! Good luck!";

	});


	checkButton.addEventListener("click", function() {
		targetLocationText.innerText = "";
		if(targetLocationMarker != null)
			targetLocationMarker.setMap(null);

		let distance = Math.round(util.distanceTo(streetView, targetLocation.pos));
		if (distance <= 100) {
			util.setMapVisibility(true);
			targetLocationMarker = new google.maps.Marker({ position: targetLocation.pos });
			targetLocationMarker.setMap(googleMap);
			googleMap.panTo(targetLocation.pos);

			submitText.innerText = "Congrats! You are " + distance + " meters away from " + targetLocation.name;
		}
		else {
			submitText.innerText = "Unfortunately, you were " + distance + " meters away from " + targetLocation.name + ". Try again!";

			util.warpTo(googleMap, streetView, mit_locations.spawn_point);
		}
	});


	revealButton.addEventListener("click", function() {
		if(targetLocationMarker != null)
			targetLocationMarker.setMap(null);
		util.setMapVisibility(true);
		targetLocationText.innerText = "";
		submitText.innerText = "Here is the location of " + targetLocation.name + " on the map.";

		targetLocationMarker = new google.maps.Marker({ position: targetLocation.pos });
		targetLocationMarker.setMap(googleMap);
		googleMap.panTo(targetLocation.pos);

		googleMap.setZoom(17);
	});
	

	/*

	// Select random spot from available, then 
	const locationOptions = Array.from(document.querySelectorAll("label .locationOption").values());


	let targetLocation = null;

	function chooseNewLocation() {
		console.log(locationOptions);
		console.log(locationOptions[Math.floor(Math.random() * locationOptions.length)]);

		// Yes, checkbox text is hard-coded to actual category
		const randomCategory = locationOptions[Math.floor(Math.random() * locationOptions.length)].parentNode.innerText.trim();

		console.log(randomCategory);
	}


	*/

}



export {bootstrapProgram}
