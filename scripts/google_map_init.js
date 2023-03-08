const KillianCourt = { lng: -71.09100901808245, lat: 42.35797801825853 };

let googleMap = null;
let streetView = null;

function initMap() {
	let initialPos = KillianCourt;

	googleMap = new google.maps.Map(document.getElementById("map"), {
		center: initialPos,
		zoom: 18,
	});

	streetView = new google.maps.StreetViewPanorama(
		document.getElementById("pano"),
		{
			position: initialPos,
			pov: {
				heading: 336,
				pitch: 0,
			},
		})

	googleMap.setStreetView(streetView);
	// streetView.addListener("position_changed", updateDistanceText)
}

window.initMap = initMap;


export { googleMap, streetView };
