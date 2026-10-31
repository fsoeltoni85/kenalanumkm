"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

type Position = [number, number, ...number[]];
type ProvinceGeometry =
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] };
type ProvinceFeature = {
  type: "Feature";
  properties: { PROVINSI?: string; [key: string]: unknown };
  geometry: ProvinceGeometry;
};
type ProvinceCollection = { type: "FeatureCollection"; features: ProvinceFeature[] };

export type UserCoordinates = { latitude: number; longitude: number };
type IndonesiaMapProps = {
  activeProvince: string;
  userLocation: UserCoordinates | null;
  onProvinceSelect: (province: string) => void;
  onProvinceDetected: (province: string) => void;
};

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 560;
const MAP_SCALE = 23.8;
const MAP_LEFT = 29;
const MAP_TOP = 54;
const ORANGE = "#ff5b27";
const LAND = "#f4d7c6";

function project([longitude, latitude]: Position): [number, number] {
  return [MAP_LEFT + (longitude - 94) * MAP_SCALE, MAP_TOP + (7 - latitude) * MAP_SCALE];
}

function featurePath(feature: ProvinceFeature): string {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => ring.map((position, index) => {
    const [x, y] = project(position);
    return (index === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
  }).join(" ") + " Z").join(" ")).join(" ");
}

function pointInRing(longitude: number, latitude: number, ring: Position[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = ((yi > latitude) !== (yj > latitude)) &&
      (longitude < ((xj - xi) * (latitude - yi)) / ((yj - yi) || Number.EPSILON) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInFeature(longitude: number, latitude: number, feature: ProvinceFeature) {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.some((polygon) => pointInRing(longitude, latitude, polygon[0]) &&
    !polygon.slice(1).some((hole) => pointInRing(longitude, latitude, hole)));
}

function provinceAt(data: ProvinceCollection, point: UserCoordinates) {
  const feature = data.features.find((item) => pointInFeature(point.longitude, point.latitude, item));
  return feature?.properties.PROVINSI;
}


function ProvinceSvgFallback({ data, activeProvince, userLocation, onProvinceSelect }: {
  data: ProvinceCollection;
  activeProvince: string;
  userLocation: UserCoordinates | null;
  onProvinceSelect: (province: string) => void;
}) {
  const point = userLocation && userLocation.longitude >= 94 && userLocation.longitude <= 142 &&
    userLocation.latitude >= -12 && userLocation.latitude <= 7
    ? project([userLocation.longitude, userLocation.latitude]) : null;

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={"0 0 " + SVG_WIDTH + " " + SVG_HEIGHT}
      role="group" aria-label="Peta provinsi Indonesia. Pilih provinsi untuk membuka leaderboard." preserveAspectRatio="xMidYMid meet">
      <defs><filter id="user-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {data.features.map((feature) => {
        const name = feature.properties.PROVINSI ?? "Provinsi";
        return <path key={String(feature.properties.KODE_PROV ?? name)} d={featurePath(feature)}
          fill={name === activeProvince ? ORANGE : LAND} fillRule="evenodd" stroke="#fff" strokeWidth="1.5"
          vectorEffect="non-scaling-stroke" role="button" tabIndex={0} aria-label={"Pilih provinsi " + name}
          className="province-shape" onClick={() => onProvinceSelect(name)}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onProvinceSelect(name); } }} />;
      })}
      {point && <g className="user-map-pin" filter="url(#user-glow)" pointerEvents="none">
        <circle cx={point[0]} cy={point[1]} r="16" fill="#2d64df" opacity=".16"/>
        <circle cx={point[0]} cy={point[1]} r="8" fill="#2d64df" stroke="#fff" strokeWidth="4"/>
      </g>}
    </svg>
  );
}

export default function IndonesiaMap({ activeProvince, userLocation, onProvinceSelect, onProvinceDetected }: IndonesiaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<MapLibreMarker | null>(null);
  const onSelectRef = useRef(onProvinceSelect);
  const onDetectedRef = useRef(onProvinceDetected);
  const [geoData, setGeoData] = useState<ProvinceCollection | null>(null);
  const [mapError, setMapError] = useState(false);
  const userIsOnMap = !!userLocation && userLocation.longitude >= 94 && userLocation.longitude <= 142 &&
    userLocation.latitude >= -12 && userLocation.latitude <= 7;

  useEffect(() => { onSelectRef.current = onProvinceSelect; }, [onProvinceSelect]);
  useEffect(() => { onDetectedRef.current = onProvinceDetected; }, [onProvinceDetected]);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/indonesia-38-provinces.geojson")
      .then((response) => { if (!response.ok) throw new Error("GeoJSON unavailable"); return response.json() as Promise<ProvinceCollection>; })
      .then((data) => { if (!cancelled) setGeoData(data); })
      .catch(() => { if (!cancelled) setMapError(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!geoData || !userLocation) return;
    const detected = provinceAt(geoData, userLocation);
    if (detected) onDetectedRef.current(detected);
  }, [geoData, userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
    if (!geoData || !containerRef.current || mapRef.current || mapError) return;
    let disposed = false;
    let localMap: MapLibreMap | null = null;
    let localMarker: MapLibreMarker | null = null;

    const initialise = async () => {
      try {
        const maplibre = await import("maplibre-gl");
        if (disposed || !containerRef.current) return;
        localMap = new maplibre.Map({
          container: containerRef.current,
          attributionControl: false,
          style: {
            version: 8,
            sources: { provinces: { type: "geojson", data: geoData as never } },
            layers: [
              { id: "ocean", type: "background", paint: { "background-color": "#dcebf1" } },
              { id: "province-fill", type: "fill", source: "provinces", paint: {
                "fill-color": ["case", ["==", ["get", "PROVINSI"], activeProvince], ORANGE, LAND],
                "fill-opacity": 1,
              } },
              { id: "province-outline", type: "line", source: "provinces", paint: { "line-color": "#fff", "line-width": 1.4 } },
              { id: "province-edge", type: "line", source: "provinces", paint: { "line-color": "#e6b79e", "line-width": .45 } },
            ],
          },
          center: [118, -2], zoom: 3, minZoom: 2.1, maxZoom: 8, maxBounds: [[90, -16], [146, 10]],
          dragRotate: false, pitchWithRotate: false, touchPitch: false, renderWorldCopies: false,
        });
        mapRef.current = localMap;
        localMap.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
        localMap.once("load", () => {
          localMap?.fitBounds([[94, -12], [142, 7]], { padding: { top: 55, right: 36, bottom: 50, left: 36 }, duration: 0 });
          localMap?.on("click", "province-fill", (event) => {
            const name = event.features?.[0]?.properties?.PROVINSI;
            if (typeof name === "string") onSelectRef.current(name);
          });
          localMap?.on("mouseenter", "province-fill", () => { if (localMap) localMap.getCanvas().style.cursor = "pointer"; });
          localMap?.on("mouseleave", "province-fill", () => { if (localMap) localMap.getCanvas().style.cursor = ""; });
          if (userIsOnMap && userLocation) {
            const element = document.createElement("div");
            element.className = "device-location-pin";
            element.setAttribute("aria-label", "Lokasi perangkat kamu");
            localMarker = new maplibre.Marker({ element, anchor: "center" })
              .setLngLat([userLocation.longitude, userLocation.latitude]).addTo(localMap);
            markerRef.current = localMarker;
          }
        });
        localMap.on("error", (event) => {
          const message = event.error instanceof Error ? event.error.message : String(event.error ?? "");
          if (/webgl|context/i.test(message) && !disposed) {
            localMap?.remove();
            localMap = null;
            mapRef.current = null;
            setMapError(true);
          }
        });
      } catch {
        if (!disposed) setMapError(true);
      }
    };
    void initialise();
    return () => {
      disposed = true;
      localMarker?.remove();
      localMap?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [geoData, mapError]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("province-fill")) return;
    map.setPaintProperty("province-fill", "fill-color", [
      "case", ["==", ["get", "PROVINSI"], activeProvince], ORANGE, LAND,
    ]);
  }, [activeProvince]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || !userIsOnMap) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (markerRef.current) markerRef.current.setLngLat([userLocation.longitude, userLocation.latitude]);
    else {
      void import("maplibre-gl").then((maplibre) => {
        if (!mapRef.current || markerRef.current) return;
        const element = document.createElement("div");
        element.className = "device-location-pin";
        element.setAttribute("aria-label", "Lokasi perangkat kamu");
        markerRef.current = new maplibre.Marker({ element, anchor: "center" })
          .setLngLat([userLocation.longitude, userLocation.latitude]).addTo(mapRef.current);
      });
    }
  }, [userLocation?.latitude, userLocation?.longitude, userIsOnMap]);

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden rounded-[17px] bg-[#dcebf1]">
      {geoData && mapError
        ? <ProvinceSvgFallback data={geoData} activeProvince={activeProvince} userLocation={userIsOnMap ? userLocation : null} onProvinceSelect={onProvinceSelect} />
        : <div ref={containerRef} className="absolute inset-0" aria-label="Peta interaktif 38 provinsi Indonesia" />}
      {!geoData && !mapError && <div className="map-loading">Memuat peta Indonesia…</div>}
      <div className="map-overlay-label"><span className="map-overlay-dot" />{activeProvince}</div>
      {userIsOnMap && <div className="map-user-label"><span /> Lokasi kamu</div>}
      {mapError && !geoData && <div className="map-loading">Peta belum dapat dimuat. Coba segarkan halaman.</div>}
    </div>
  );
}
