let socket = io.connect();

let storedOriginPoint;
let nodeValue = Math.floor((Math.random()) * (300 - 75 + 1)) + 75;



// let nodeDistance = 30;

socket.on('origin-point',function(incomingPosition){
  storedOriginPoint = incomingPosition;
  $('.origin-point-readout').text(storedOriginPoint.lat + ',' + storedOriginPoint.lon)

})


if ("geolocation" in navigator) {
  /* geolocation is available */
  // get our position every interval
  setInterval(function(){
    $('.generated-distance').text(nodeValue);
    socket.emit('get-origin-point');
    navigator.geolocation.getCurrentPosition(function(position) {
      // console.log(position)
      console.log(position.coords.latitude)
      console.log(position.coords.longitude)
      //distance from the our origin point
      let gd = miles2feet( calcGeoDistance(position.coords.latitude, position.coords.longitude, storedOriginPoint.lat, storedOriginPoint.lon ) );

      let nodeDistance = calcNodeDistance( nodeValue, gd);


      if(gd <= 0){
        $('.our-distance').text( Math.round( gd ) )

      }else{
        $('.our-distance').text("you've reached your network node, stand by for others to occupy their positions")
      }






    });
  }, 1000)



} else {
  /* geolocation IS NOT available */
  console.error('no geolocation available!')
}



//convert miles to feet
function miles2feet(miles){
  return miles * 5280;
}


// //distance to assigned number
// function distance2node(feet){
//   return nodeDistance - gd;
// }



// http://www.movable-type.co.uk/scripts/latlong.html
// Used Under MIT License
function calcGeoDistance(lat1, lon1, lat2, lon2){

    var R = 3959; // earth radius in Miles (default)

    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}


function calcNodeDistance(genD, geoD){
  return genD-geoD;
}


let port = process.env.PORT || 3000;
