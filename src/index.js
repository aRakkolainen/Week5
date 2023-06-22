import "./styles.css";
import "./leaflet.css";
import L from "./leaflet";

const fetchData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const response = await fetch(url); 
    const geoJSONData = await response.json(); 
    initializeMap(geoJSONData);
}; 

const initializeMap = (geoJSONData) = () => {
    let map = L.map('map', {
        minZoom: -3, 
    })
    let geoJSON = L.geoJSON(geoJSONData,{
        weigth: 2, 
    }).addTo(map)
    map.fitBounds(geoJSON.getBounds()); 
}