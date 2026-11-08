mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});



// create a marker at a coordinate
const marker = new mapboxgl.Marker({ color: '#FF0000'})
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

  const popup = new mapboxgl.Popup()
  .setHTML(`<h3>${listing.location},${listing.country}</h3><p>This Location is just for reference and not exact.Contact User to confirm location.</p>`);

marker.setPopup(popup);