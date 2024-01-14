import React, { useState, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const osmLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Point(fromLonLat(position)))],
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    });

    const initialMap = new Map({
      target: mapElement.current!,
      layers: [osmLayer, vectorLayer],
      view: new View({
        center: fromLonLat(position),
        zoom: 10,
      }),
    });

    setMap(initialMap);

    return () => initialMap.dispose();
  }, []);

  useEffect(() => {
    if (map) {
      const view = map.getView();
      view.setCenter(fromLonLat(position));
      const vectorSource = map.getLayers().getArray()[1].getSource();
      vectorSource.clear();
      vectorSource.addFeature(new Feature(new Point(fromLonLat(position))));
    }
  }, [position]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Replace this with your own code to get the current position
      const newPosition = [77.5946, 12.9716];
      setPosition(newPosition);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div id="map" ref={mapElement} style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;