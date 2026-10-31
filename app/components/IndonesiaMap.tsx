"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

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

type IndonesiaMapProps = {
  activeProvince: string;
  onProvinceSelect: (province: string) => void;
};

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 560;
const MAP_SCALE = 23.8;
const MAP_LEFT = 29;
const MAP_TOP = 54;

function project([longitude, latitude]: Position): [number, number] {
  return [
    MAP_LEFT + (longitude - 94) * MAP_SCALE,
    MAP_TOP + (7 - latitude) * MAP_SCALE,
  ];
}

function featurePath(feature: ProvinceFeature): string {
  const polygons = feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;

  return polygons.map((polygon) => polygon.map((ring) => {
    return ring.map((position, index) => {
      const [x, y] = project(position);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ") + " Z";
  }).join(" ")).join(" ");
}

function ProvinceSvgFallback({
  data,
  activeProvince,
  onProvinceSelect,
}: {
  data: ProvinceCollection;
  activeProvince: string;
  onProvinceSelect: (province: string) => void;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      role="group"
      aria-label="Peta provinsi Indonesia. Pilih bentuk provinsi untuk melihat wilayah."
      preserveAspectRatio="xMidYMid meet"
    >
      {data.features.map((feature) => {
        const name = feature.properties.PROVINSI ?? "Provinsi";
        const selected = name === activeProvince;
        return (
          <path
            key={String(feature.properties.KODE_PROV ?? name)}
            d={featurePath(feature)}
            fill={selected ? "#16835b" : "#c8dfd2"}
            fillRule="evenodd"
            stroke="#ffffff"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
            role="button"
            tabIndex={0}
            aria-label={`Pilih provinsi ${name}`}
            className="cursor-pointer transition-colors hover:fill-[#8fbea4] focus:outline-none focus:stroke-[#0f6445]"
            onClick={() => onProvinceSelect(name)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onProvinceSelect(name);
              }
            }}
          />
        );
      })}
    </svg>
  );
}

export default function IndonesiaMap({ activeProvince, onProvinceSelect }: IndonesiaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onProvinceSelect);
  const [fallbackData, setFallbackData] = useState<ProvinceCollection | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    onSelectRef.current = onProvinceSelect;
  }, [onProvinceSelect]);

  useEffect(() => {
    let disposed = false;
    let map: MapLibreMap | null = null;
    let fallbackStarted = false;

    const activateFallback = async () => {
      if (fallbackStarted || disposed) return;
      fallbackStarted = true;
      map?.remove();
      map = null;
      mapRef.current = null;

      try {
        const response = await fetch("/data/indonesia-38-provinces.geojson");
        if (!response.ok) throw new Error(`GeoJSON request failed: ${response.status}`);
        const data = await response.json() as ProvinceCollection;
        if (!disposed) setFallbackData(data);
      } catch {
        if (!disposed) setMapError(true);
      }
    };

    const initialize = async () => {
      try {
        const maplibre = await import("maplibre-gl");
        if (disposed || !containerRef.current) return;

        try {
          map = new maplibre.Map({
            container: containerRef.current,
            attributionControl: false,
            style: {
              version: 8,
              sources: {
                provinces: {
                  type: "geojson",
                  data: "/data/indonesia-38-provinces.geojson",
                },
              },
              layers: [
                {
                  id: "ocean",
                  type: "background",
                  paint: { "background-color": "#e8f2f3" },
                },
                {
                  id: "province-fill",
                  type: "fill",
                  source: "provinces",
                  paint: {
                    "fill-color": [
                      "case",
                      ["==", ["get", "PROVINSI"], activeProvince],
                      "#16835b",
                      "#c8dfd2",
                    ],
                    "fill-opacity": 1,
                  },
                },
                {
                  id: "province-outline",
                  type: "line",
                  source: "provinces",
                  paint: {
                    "line-color": "#ffffff",
                    "line-width": 1.15,
                    "line-opacity": 0.95,
                  },
                },
                {
                  id: "province-edge",
                  type: "line",
                  source: "provinces",
                  paint: {
                    "line-color": "#8bb8a1",
                    "line-width": 0.45,
                    "line-opacity": 0.9,
                  },
                },
              ],
            },
            center: [118, -2],
            zoom: 3,
            minZoom: 2.1,
            maxZoom: 8,
            maxBounds: [[90, -16], [146, 10]],
            dragRotate: false,
            pitchWithRotate: false,
            touchPitch: false,
            renderWorldCopies: false,
          });
        } catch {
          await activateFallback();
          return;
        }

        mapRef.current = map;
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
        map.once("load", () => {
          map?.fitBounds([[94, -12], [142, 7]], {
            padding: { top: 45, right: 48, bottom: 45, left: 48 },
            duration: 0,
          });
          map?.on("click", "province-fill", (event) => {
            const province = event.features?.[0]?.properties?.PROVINSI;
            if (typeof province === "string") onSelectRef.current(province);
          });
          map?.on("mouseenter", "province-fill", () => {
            if (map) map.getCanvas().style.cursor = "pointer";
          });
          map?.on("mouseleave", "province-fill", () => {
            if (map) map.getCanvas().style.cursor = "";
          });
        });
        map.on("error", (event) => {
          const message = event.error instanceof Error ? event.error.message : String(event.error ?? "");
          if (/webgl|context/i.test(message)) void activateFallback();
        });
      } catch {
        await activateFallback();
      }
    };

    void initialize();

    return () => {
      disposed = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const updateFill = () => {
      if (!map.getLayer("province-fill")) return;
      map.setPaintProperty("province-fill", "fill-color", [
        "case",
        ["==", ["get", "PROVINSI"], activeProvince],
        "#16835b",
        "#c8dfd2",
      ]);
    };
    if (map.isStyleLoaded()) updateFill();
    else map.once("load", updateFill);
  }, [activeProvince]);

  return (
    <div className="relative h-full min-h-[430px] w-full overflow-hidden rounded-[1.45rem] bg-[#e8f2f3]">
      {fallbackData ? (
        <ProvinceSvgFallback
          data={fallbackData}
          activeProvince={activeProvince}
          onProvinceSelect={onProvinceSelect}
        />
      ) : (
        <div ref={containerRef} className="absolute inset-0" aria-label="Peta interaktif provinsi Indonesia" />
      )}
      {mapError && !fallbackData && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-[#53645a]">
          Peta belum dapat dimuat. Coba segarkan halaman.
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 z-[1] flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-[#34443b] shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-[#16835b]" />
        {activeProvince || "Indonesia"}
        <span className="font-normal text-[#78877f]">· pilih provinsi</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-[1] rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[11px] text-[#66766d] shadow-sm">
        {fallbackData ? "Mode peta ringan · pilih provinsi" : "Geser untuk menjelajah · scroll untuk zoom"}
      </div>
    </div>
  );
}
