mapboxgl.accessToken = mapToken;

// Validate coordinates
const coords = Array.isArray(listing.geometry?.coordinates) && listing.geometry.coordinates.length === 2
  ? listing.geometry.coordinates
  : [77.209, 28.6139]; // fallback to Delhi

// Initialize map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: coords,
  zoom: 10,
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// Add marker only if coords are valid
if (coords.length === 2) {
  const popupHTML = `
    <div style="font-weight:600; font-size:14px; line-height:1.3;">
      ${listing.location || 'Unknown Location'}, ${listing.country || ''} <br/>
      <small style="font-weight:400; font-size:13px; color:#aaa;">
        Exact Location Provided After Booking
      </small>
    </div>
  `;

  const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false }).setHTML(popupHTML);

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(popup)
    .addTo(map);
} else {
  console.warn('Invalid coordinates for marker:', coords);
}

// Resize map on window change
window.addEventListener('resize', () => map.resize());
