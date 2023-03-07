import * as util from "./util.js";

let map;
let panorama;
let place;

function initMap() {
	place = { lng: -71.09100901808245, lat: 42.35797801825853 };

	map = new google.maps.Map(document.getElementById("map"), {
		center: place,
		zoom: 18,
	});

	var heatmap = new google.maps.visualization.HeatmapLayer({
		data: [],
		map: map,
		radius: 16
	})

	map.addListener("click", function(e) {
		console.log(e);
		heatmap.getData().push(e.latLng);
		console.log("Latitude: " + e.latLng.lat());
		console.log("Longitude: " + e.latLng.lng());
	})

	panorama = new google.maps.StreetViewPanorama(
		document.getElementById("pano"),
		{
			position: place,
			pov: {
				heading: 34,
				pitch: 10,
			},
		})

	map.setStreetView(panorama);
}

window.initMap = initMap;


function updateDistanceText() {
	var distanceText = document.getElementById("distance");

	var currentPos = panorama.getLocation().latLng;
	var doubleDist = util.getHaversineDist(place.lat, place.lng, currentPos.lat(), currentPos.lng());

	distance.innerText = "Current Distance: " + Math.round(doubleDist * 1000) + " meters";
}


var distButton = document.getElementById("distButton");
distButton.onclick = updateDistanceText;
panorama.position_changed = updateDistanceText;

