// erstellt objekt anzeige attributionszeile
var attribution = new ol.control.Attribution({
  collapsible: false,
})
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
})
//anzeige vektordaten
var layer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(
          ol.proj.fromLonLat([13.7484704, 51.0439512])
        ),
      }),
    ],
  }),
})
map.addLayer(layer)

var container = document.getElementById("popup")
var content = document.getElementById("popup-content")
var closer = document.getElementById("popup-closer")

var overlay = new ol.Overlay({
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
    var coordinate = event.coordinate
    // wird nur beim anklicken angezeigt
    //Popup text
    content.innerHTML =
      "<b>Deutsches Hygiene Museum </b><br />Ich habe Baierrefreie Eingaenge und Ausgaenge."
    overlay.setPosition(coordinate)
  } else {
    overlay.setPosition(undefined)
    closer.blur()
    // wenn nicht ausgewählt undefiniert
  }
})
