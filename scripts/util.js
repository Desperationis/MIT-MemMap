function getHaversineDist(lat1, long1, lat2, long2) {
	Number.prototype.toRad = function() {
	   return this * Math.PI / 180;
	}

	var R = 6371; // km 
	//has a problem with the .toRad() method below.
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = long2-long1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
					Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;

	return d; // in km
}

export {getHaversineDist};
