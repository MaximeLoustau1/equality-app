import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './WorldMap.css';

const COUNTRY_NAME_ALIASES = {
  "australia": "Australia",
  "austria": "Austria",
  "belgium": "Belgium",
  "canada": "Canada",
  "czech republic": "Czech Republic",
  "denmark": "Denmark",
  "finland": "Finland",
  "france": "France",
  "germany": "Germany",
  "greece": "Greece",
  "hong kong": "Hong Kong",
  "ireland": "Ireland, Republic of",
  "ireland, republic of": "Ireland, Republic of",
  "israel": "Israel",
  "italy": "Italy",
  "japan": "Japan",
  "luxembourg": "Luxembourg",
  "netherlands": "Netherlands",
  "new zealand": "New Zealand",
  "norway": "Norway",
  "poland": "Poland",
  "portugal": "Portugal",
  "singapore": "Singapore",
  "spain": "Spain",
  "sweden": "Sweden",
  "switzerland": "Switzerland",
  "united kingdom": "United Kingdom",
  "england": "United Kingdom",
  "united states": "United States of America",
  "united states of america": "United States of America",
  "usa": "United States of America"
};

export default function WorldMap({ onCountrySelect, selectedCountries }) {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [countryScores, setCountryScores] = useState([]);

  useEffect(() => {
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(setGeoData);

    fetch('http://localhost:8000/countries-average-score')
      .then(res => res.json())
      .then(setCountryScores);
  }, []);

  useEffect(() => {
    if (!geoData || !countryScores.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 600;

    const projection = d3.geoNaturalEarth1().scale(160).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const scoreMap = {};
    countryScores.forEach(d => {
      scoreMap[d.country.toLowerCase()] = d.score;
    });

    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([30, 100]);

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => {
        const rawName = d.properties.name.trim().toLowerCase();
        const backendName = COUNTRY_NAME_ALIASES[rawName] || rawName;
        const match = scoreMap[backendName.toLowerCase()];
        return match ? colorScale(match) : '#333';
      })
      .attr('stroke', '#222')
      .style('cursor', 'pointer')
      .classed('selected', d => selectedCountries.includes(d.properties.name))
      .on('click', function (event, d) {
        const rawName = d.properties.name.trim().toLowerCase();
        const backendName = COUNTRY_NAME_ALIASES[rawName] || rawName;
        onCountrySelect(backendName);
      })
      .on('mouseenter', function (event, d) {
        const rawName = d.properties.name.trim();
        const lookupKey = COUNTRY_NAME_ALIASES[rawName.toLowerCase()] || rawName.toLowerCase();
        const score = scoreMap[lookupKey] ?? 'N/A';
        d3.select('#tooltip')
          .style('opacity', 1)
          .html(`<strong>${rawName}</strong><br/>Score: ${score}`);
      })
      .on('mousemove', function (event) {
        d3.select('#tooltip')
          .style('left', event.pageX + 15 + 'px')
          .style('top', event.pageY + 'px');
      })
      .on('mouseleave', function () {
        d3.select('#tooltip').style('opacity', 0);
      });
  }, [geoData, countryScores, onCountrySelect, selectedCountries]);

  return (
    <div className="map-container">
      <svg ref={svgRef}></svg>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
}
