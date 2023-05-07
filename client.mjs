const points = [
  {
    name: "Hygiene Museum",
    lon: 13.746803,
    lat: 51.044387,
    description:
      "Rollstuhlgerecht, Leitstreifen und Brailleschrift,Angebote in Gebärdensprache",
  },
  {
    name: "Toilette",
    lon: 13.7463836,
    lat: 51.0445022,
    description: "Rollstuhlgerecht",
  },
  {
    name: "Rudolf Harbig Stadion",
    lon: 13.748038,
    lat: 51.040855,
    description: "Rollstuhlgerechtes WC; extra Rampe und Tribüne",
  },
  {
    name: "Gläserne Manufaktur",
    lon: 13.755934,
    lat: 51.044546,
    description: "leichte Sprache; seperate Toilette für Rollstuhlfahrer*innen",
  },
];

// erstellt objekt anzeige attributionszeile
var attribution = new ol.control.Attribution({
  collapsible: false,
});
// erstellung und verwaltung der Karte
var map = new ol.Map({
  controls: ol.control.defaults({ attribution: false }).extend([attribution]),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
        attributions: [
          ol.source.OSM.ATTRIBUTION,
          'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        ],
        maxZoom: 18,
      }),
    }),
  ],
  // anfangsansicht
  target: "map",
  view: new ol.View({
    center: ol.proj.fromLonLat([13.7484704, 51.0439512]),
    maxZoom: 18,
    zoom: 12,
  }),
});
//anzeige vektordaten
var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: points.map(
      (point) =>
        new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat([point.lon, point.lat])
          ),
          point: point,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: "red",
            }),
            stroke: new ol.style.Stroke({
              color: "white",
            }),
          }),
        })
    ),
  }),
});
map.addLayer(layer);

var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
map.addOverlay(overlay);

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
map.on("singleclick", function (event) {
  if (map.hasFeatureAtPixel(event.pixel) === true) {
    const feature = map.getFeaturesAtPixel(event.pixel)[0];
    const point = feature.values_.point;

    // Popup wird nur beim anklicken angezeigt

    // Name und Beschreibung anzeigen
    content.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("popBox");
    const b = document.createElement("b");
    b.append(point.name);
    div.append(b, document.createElement("br"), point.description);
    content.append(div);

    overlay.setPosition(event.coordinate);
  } else {
    // wenn nicht ausgewählt, zeige kein Popup
    overlay.setPosition(undefined);
    closer.blur();
  }
});

const searchResultBox = document.getElementById("search_results");
document.getElementById("search").oninput = (event) => {
  const relevantPoints = points.filter((point) =>
    point.name.toLowerCase().includes(event.target.value.toLowerCase())
  );

  // Suchergebnisse löschen
  searchResultBox.innerHTML = "";

  // Aktuelle Suchergebnisse einfügen
  for (const point of relevantPoints) {
    const div = document.createElement("div");
    div.classList.add("search_result");
    const b = document.createElement("b");
    b.append(point.name);
    div.append(b, document.createElement("br"), point.description);
    searchResultBox.append(div);
  }
};
