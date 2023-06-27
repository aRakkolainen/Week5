import "./styles.css";
import "./leaflet/leaflet.css";
import L from "./leaflet/leaflet";
//Based on the course material!
const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const response = await fetch(url);
  const geoJSONData = await response.json();
  const urlNegative =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const urlPositive =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const negativeResponse = await fetch(urlNegative);
  const negativeJSON = await negativeResponse.json();
  //console.log(negativeJSON);
  const positiveResponse = await fetch(urlPositive);
  const positiveJSON = await positiveResponse.json();
  let negativeMigration = negativeJSON.dataset.value;
  let positiveMigration = positiveJSON.dataset.value;

  let features = geoJSONData.features;
  for (let i = 0; i < features.length; i++) {
    //console.log(features[i]);
    features[i].properties.negative = negativeMigration[i];
    features[i].properties.positive = positiveMigration[i];
    let hue = Math.pow(positiveMigration[i] / negativeMigration[i], 3) * 60;
    if (hue < 120) {
      features[i].properties.hue = Math.ceil(hue);
    }
  }
  initializeMap(geoJSONData);
};

const initializeMap = (geoJSONData) => {
  let map = L.map("map", {
    minZoom: -3
  });
  let geoJSON = L.geoJSON(geoJSONData, {
    onEachFeature: getFeature,
    weigth: 2,
    style: getStyle
  }).addTo(map);

  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    onEachFeature: getFeature,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  map.fitBounds(geoJSON.getBounds());
};

const getFeature = (feature, layer) => {
  const name = feature.properties.name;
  const negativeMig = feature.properties.negative;
  const positiveMig = feature.properties.positive;
  layer.bindTooltip(name);

  layer.bindPopup(`<ul>
<li>Negative migration: ${negativeMig}</li>
<li>Positive migration: ${positiveMig}</li>`);
};
const getStyle = (feature) => {
  return {
    //Help with using variables in hsl: https://stackoverflow.com/questions/67066318/passing-variables-into-hsl-color-values-in-three-js
    color: `hsl(${feature.properties.hue}, 75%, 50%)`
  };
};
fetchData();
