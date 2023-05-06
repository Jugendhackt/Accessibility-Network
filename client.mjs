import "ol/ol.css"
import Map from "ol/Map"
import View from "ol/View"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import { OSM, Vector as VectorSource } from "ol/source"
import { fromLonLat } from "ol/proj"
import Overlay from "ol/Overlay"
import { defaults as defaultControls } from "ol/control"

// JSON Daten
const location = [
  {
    "name": "Deutsches Hygiene Museum",
    "latitude": 51.0442718,
    "longitude": 13.7447284,
    "icon": "museum",
    "accessibility": "Rollstulltauglich und Behindertengerechtes WC und Behindertenparkplatz",
    "accessibilityBlind": "Blindenschrift und Leitstreifen Flyer mit Blindenschrift",
    "accessibilityDeaf": "Angebote in Deutscher Gebärdensprache",
    "wheelchairLatitude": 51.0445022,
    "wheelchairLongitude": 13.7463836
  }
]

// OpenLayers Karte
const attribution = new ol.control.Attribution({
  collapsible: false,
})

const map = new Map({
  controls: defaultControls({ attribution: false }).extend([attribution]),
  layers: [
    new TileLayer({
      source: new OSM({
        url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
        attributions: [
          OSM.ATTRIBUTION,
          'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        ],
        maxZoom: 18,
      }),
    }),
  ],
  target: "map",
  view: new View({
    center: fromLonLat([location[0].longitude, location[0].latitude]),
    maxZoom: 18,
    zoom: 12,
  }),
})

const layer = new VectorLayer({
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Point(fromLonLat([location[0].longitude, location[0].latitude])),
      }),
    ],
  }),
})

map.addLayer(layer)

const container = document.getElementById("popup")
const content = document.getElementById("popup-content")
const closer = document.getElementById("popup-closer")

const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
})
map.addOverlay(overlay)

closer.onclick = function () {
  overlay.setPosition(undefined)
  closer.blur()
  return false
}

map.on("singleclick", function (event) {
  if (map.hasFeatureAtPixel(event.pixel) === true) {
    const coordinate = event.coordinate
    content.innerHTML = `<b>${location[0].name}</b><br/>${location[0].accessibility}`
    overlay.setPosition(coordinate)
  } else {
    overlay.setPosition(undefined)
    closer.blur()
  }
})
