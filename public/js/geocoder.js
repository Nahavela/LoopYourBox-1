mapboxgl.accessToken = 'pk.eyJ1IjoiYmVjb2RlbmV0cCIsImEiOiJja2gyNngzbHYwOW1pMnBwY2hkODZuenlqIn0.gh5aASyG_4J54nUTh9LMyA';
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
countries: 'be'
});
    
geocoder.addTo('#geocoder');

const address = document.getElementById('address');

geocoder.on('result', function(data) {

    let cleanContext = data.result.context.map( element => {
        if (element.id.split('.')[0] == "postcode" || 
            element.id.split('.')[0] == "place" || 
            element.id.split('.')[0] == "country" )
               {return element.text}
            })

        .filter(element=> {if(element) return element});

    let addressInfo = {
        coordinates : data.result.center,
        street: data.result.place_name.split(',')[0],
        postcode: cleanContext[0],
        city: cleanContext[1],
        country: cleanContext[2],
        place_name: data.result.place_name
    }
    //console.log(addressInfo)
    //console.log(data.result)
    address.value = JSON.stringify(addressInfo); 
})

let url = window.location.href;
if (url.startsWith(`http://localhost:3000/updatePartner`)) {
    const placeName = document.getElementById('place_name').value;
    const geocoderInput = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0];
    geocoderInput.value =  placeName;
} 

