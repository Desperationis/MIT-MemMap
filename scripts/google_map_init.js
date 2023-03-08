let googleMap = null;
let streetView = null;

function initMap() {
	googleMap = new google.maps.Map(document.getElementById("map"), {
		zoom: 18,
	});

	streetView = new google.maps.StreetViewPanorama(document.getElementById("pano"), {})

	googleMap.setStreetView(streetView);
	// streetView.addListener("position_changed", updateDistanceText)
	
	fetch("./mit_locations.json")
		.then(response => response.json())
		.then(mit_locations => { 
			console.log(mit_locations);
			googleMap.setCenter(mit_locations.killian_court);
			streetView.setPosition(mit_locations.killian_court);
			streetView.setPov({ heading: 336, pitch: 0});
		});

}

window.initMap = initMap;


export { googleMap, streetView };
