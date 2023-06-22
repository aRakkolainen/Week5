import "./styles.css";
import "./leaflet/leaflet.css";
import L from "./leaflet/leaflet";
//Based on the course material!
const fetchData = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const response = await fetch(url);
  const geoJSONData = await response.json();
  /*const urlNegative =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
  const urlPositive =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const negativeResponse = await fetch(urlNegative);
  const negativeJSON = await negativeResponse.json();
  //console.log(negativeJSON);
  const positiveResponse = await fetch(urlPositive);
  const positiveJSON = await positiveResponse.json();*/
  initializeMap(geoJSONData);
};

const initializeMap = (geoJSONData) => {
  let map = L.map("map", {
    minZoom: -3
  });
  let geoJSON = L.geoJSON(geoJSONData, {
    onEachFeature: getFeature,
    weigth: 2
  }).addTo(map);
  map.fitBounds(geoJSON.getBounds());
};

const getFeature = (feature, layer, data1, data2) => {
  const name = feature.properties.name;
  layer.bindTooltip(name);
  /*layer.bindPopUp(`<ul>
<li>Negative migration: ${data1[nega_index]}</li>
<li>Positive migration: ${data2[posi_index]}`);*/
};

fetchData();
