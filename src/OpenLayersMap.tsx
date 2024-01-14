import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import Geolocation from 'ol/Geolocation';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

const OpenLayersMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const map = new Map({
      target: mapRef.current as HTMLDivElement,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [0, 0],
        zoom: 18,
        projection: 'EPSG:4326', // Specify the projection for the view
      }),
    });

    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });

    geolocation.setTracking(true);

    const markerOverlay = new Overlay({
      element: markerRef.current as HTMLDivElement,
      stopEvent: false,
      offset: [0, 0],
    });

    map.addOverlay(markerOverlay);

    geolocation.once('change:position', () => {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        const lonLat = fromLonLat(coordinates,'EPSG:4326');
        console.log(coordinates)
        map.getView().setCenter(lonLat);
        markerOverlay.setPosition(lonLat);
      }
    });

    geolocation.on('change:position', () => {
      const coordinates = geolocation.getPosition();
      console.log(coordinates)
      if (coordinates) {
        const lonLat = fromLonLat(coordinates,'EPSG:4326');
        map.getView().setCenter(lonLat);
        markerOverlay.setPosition(lonLat);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '600px' }}>
      <div
        ref={markerRef}
        style={{
          width: '20px',
          height: '20px',
          background: 'red',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default OpenLayersMap;
