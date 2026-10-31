"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

type IndonesiaMapProps = {
  activeProvince: string;
  onProvinceSelect: (province: string) => void;
};

export default function IndonesiaMap({ activeProvince, onProvinceSelect }: IndonesiaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onProvinceSelect);

  useEffect(() => {
    onSelectRef.current = onProvinceSelect;
  }, [onProvinceSelect]);

  useEffect(() => {
    let disposed = false;
    let map: MapLibreMap | null = null;

    const initialize = async () => {
      const maplibre = await import("maplibre-gl");
      if (disposed || !containerRef.current) return;

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

      mapRef.current = map;
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
      map.once("load", () => {
        map?.fitBounds([[94, -12], [142, 7]], {
          padding: { top: 45, right: 48, bottom: 45, left: 48 },
          duration: 0,
        });
      });
      map.on("click", "province-fill", (event) => {
        const province = event.features?.[0]?.properties?.PROVINSI;
        if (typeof province === "string") onSelectRef.current(province);
      });
      map.on("mouseenter", "province-fill", () => {
        if (map) map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "province-fill", () => {
        if (map) map.getCanvas().style.cursor = "";
      });
    };

    void initialize();

    return () => {
      disposed = true;
      map?.remove();
      mapRef.current = null;
    };
  // Initialize the map once; selection changes are handled below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div ref={containerRef} className="absolute inset-0" aria-label="Peta interaktif provinsi Indonesia" />
      <div className="pointer-events-none absolute left-4 top-4 z-[1] flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-[#34443b] shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-[#16835b]" />
        {activeProvince || "Indonesia"}
        <span className="font-normal text-[#78877f]">· pilih provinsi</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-[1] rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[11px] text-[#66766d] shadow-sm">
        Geser untuk menjelajah · scroll untuk zoom
      </div>
    </div>
  );
}
