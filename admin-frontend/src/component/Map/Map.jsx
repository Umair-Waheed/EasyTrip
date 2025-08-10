import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const accessToken=import.meta.env.VITE_ACCESSTOKEN;
mapboxgl.accessToken=accessToken;

const Map = ({ destination }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !mapInitialized) {
          initializeMap();
          setMapInitialized(true);
        }
      },
      { threshold: 0.3 }
    );

    if (mapContainer.current) {
      observer.observe(mapContainer.current);
    }

    return () => {
      if (mapContainer.current) {
        observer.unobserve(mapContainer.current);
      }
    };
  }, [destination, mapInitialized]);

  const initializeMap = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          // style: 'mapbox://styles/mapbox/streets-v11',
          center: [destination.lng, destination.lat],
          zoom: window.innerWidth < 768 ? 9 : 10, // Responsive zoom
        });

        // Add destination marker
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(map.current);

        // Add user location marker
        new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([userCoords.lng, userCoords.lat])
          .addTo(map.current);

        try {
          const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${userCoords.lng},${userCoords.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
          
          const data = response.data.routes[0];
          const route = data.geometry.coordinates;

          const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route,
            },
          };

          map.current.on('load', () => {
            setTimeout(() => { // Optional smooth delay
              if (map.current.getSource('route')) {
                map.current.getSource('route').setData(geojson);
              } else {
                map.current.addLayer({
                  id: 'route',
                  type: 'line',
                  source: {
                    type: 'geojson',
                    data: geojson,
                  },
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                  },
                  paint: {
                    'line-color': '#3b9ddd',
                    'line-width': 5,
                  },
                });
              }
            }, 200);
          });

          setDistance((data.distance / 1000).toFixed(2)); // meters to kilometers
          setDuration((data.duration / 60).toFixed(0));   // seconds to minutes
        } catch (error) {
          console.error('Error fetching route:', error);
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      });
    } else {
      console.error('Geolocation is not supported');
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        ref={mapContainer}
        className={mapInitialized ? 'fade-in' : ''}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '10px',
          marginBottom: '10px',
          opacity: mapInitialized ? 1 : 0, // fallback if CSS missing
          transition: 'opacity 1s ease, transform 1s ease',
          transform: mapInitialized ? 'translateY(0)' : 'translateY(30px)',
        }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '15px' }}>
          <AutorenewIcon sx={{color:"blue", marginBottom:"5px"}}/> Calculating route...
        </div>
      ) : distance && duration ? (
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          <LocationOnIcon sx={{color:"red", marginBottom:"5px"}}/>You are <span className='font-[500]' >{distance} km</span> away.
          <br />
          <AccessTimeIcon sx={{marginBottom:"5px"}}/>Estimated Time: <span className='font-[500]'>{duration} minutes</span> (driving).
        </div>
      ) : (
        mapInitialized && (
          <div style={{ textAlign: 'center', color: 'red', marginTop: '15px' }}>
            <ErrorOutlineIcon/> Unable to calculate route.
          </div>
        )
      )}
    </div>
  );
};

export default Map