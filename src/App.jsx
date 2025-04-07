import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=50");
      const data = await res.json();
      setBreweries(data);
      setFiltered(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = breweries.filter((brewery) => {
      const nameMatch = brewery.name.toLowerCase().includes(search.toLowerCase());
      const typeMatch = filterType ? brewery.brewery_type === filterType : true;
      return nameMatch && typeMatch;
    });
    setFiltered(results);
  }, [search, filterType, breweries]);

  // Summary statistics
  const total = breweries.length;
  const numMicro = breweries.filter(b => b.brewery_type === "micro").length;
  const numLarge = breweries.filter(b => b.brewery_type === "large").length;
  const getMostCommonType = () => {
    const counts = {};
    breweries.forEach(brewery => {
      counts[brewery.brewery_type] = (counts[brewery.brewery_type] || 0) + 1;
    })
    //getting the most frequent brewery type
    return Object.entries(counts).sort((a, b) => a[1] > b[1] ? a: b)[0]?.[0];
  }
  return (
    <div className="app">
      <header>
        <h1>🍺 Brewery Dashboard</h1>
      </header>
        <div className="summary">
          <div className="summary-item">Total Breweries: {total}</div>
          <div className="summary-item">Microbreweries: {numMicro}</div>
          <div className="summary-item">Large Breweries: {numLarge}</div>
          <div className="summary-item">Most Common Brewery Type: {getMostCommonType()}</div>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Search brewery name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="micro">Micro</option>
            <option value="regional">Regional</option>
            <option value="brewpub">Brewpub</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="dashboard">
          {filtered.map((brewery) => (
            <div className="card" key={brewery.id}>
              <h2>{brewery.name}</h2>
              <p><strong>Brewery Type 🍺:</strong> {brewery.brewery_type}</p>
              <p><strong>Location 📍:</strong> {brewery.city}, {brewery.state}</p>
              {brewery.website_url && (
                <a href={brewery.website_url} target="_blank" rel="noreferrer">
                  Visit Website
                </a>
              )}          
            </div>
          ))}
        </div>
      
    </div>
  );
}

export default App;
