let googleMap = null;
let streetView = null;

function initMap() {
	googleMap = new google.maps.Map(document.getElementById("map"), {
		zoom: 18,
	});

	streetView = new google.maps.StreetViewPanorama(document.getElementById("pano"), {});
	console.log(streetView);

	googleMap.setStreetView(streetView);
	// streetView.addListener("position_changed", updateDistanceText)
	
	fetch("./mit_locations.json")
		.then(response => response.json())
		.then(mit_locations => { 
			console.log(mit_locations);
			googleMap.setCenter(mit_locations.spawn_point);
			streetView.setPosition(mit_locations.spawn_point);
			streetView.setPov({ heading: mit_locations.spawn_point.heading, pitch: mit_locations.spawn_point.pitch });
		});

}

window.initMap = initMap;


export { googleMap, streetView };
