import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const position = [51.505, -0.09]

function GeographicFilter() {
  return (

   <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ zIndex: '-999'}}>
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>

  );
}

export default GeographicFilter;

