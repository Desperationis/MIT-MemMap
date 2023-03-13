import { bootstrapProgram } from "./index.js"


let googleMap = null;
let streetView = null;

function initMap() {
	googleMap = new google.maps.Map(document.getElementById("map"), {
		zoom: 18,
	});

	streetView = new google.maps.StreetViewPanorama(document.getElementById("pano"), {});

	googleMap.setStreetView(streetView);
	// streetView.addListener("position_changed", updateDistanceText)

	bootstrapProgram();
}

// Expose to the Google API, this calls initMap() automatically on startup.
window.initMap = initMap;


export { googleMap, streetView };
