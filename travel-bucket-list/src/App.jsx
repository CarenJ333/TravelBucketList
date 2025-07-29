import { Link } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DestinationForm from "./components/DestinationForm";
import DestinationList from "./components/DestinationList";
import SearchBar from './components/SearchBar';
import FilterPanel from "./components/FilterPanel"; 

function App() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data when the component mounts
  useEffect(() => {
    fetch("https://travelbucketlist-1.onrender.com/destinations", {
        headers: { "Content-Type": "application/json" },
        mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  function handleAddDestination(newDestination) {
  console.log(" Sending:", newDestination);
  fetch("https://travelbucketlist-1.onrender.com/destinations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    method: "cors",
    body: JSON.stringify(newDestination),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(" Saved to db.json:", data);
      setDestinations([...destinations, data]);
    })
    .catch((error) => console.error(" POST error:", error));
}
function handleToggleStatus(id, currentStatus) {
  const updatedStatus = currentStatus === "Visited" ? "Not Yet" : "Visited";

  fetch(`https://travelbucketlist-1.onrender.com/destinations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    method: "cors",
    body: JSON.stringify({ status: updatedStatus })
  })
    .then(res => res.json())
    .then((updatedDestination) => {
      setDestinations(destinations.map(dest =>
        dest.id === id ? updatedDestination : dest
      ));
    });
}

  // Apply both search + filter
const filteredDestinations = destinations.filter((destination) => {
  const matchesStatus =
    statusFilter === "all" || destination.status === statusFilter;

  const matchesSearch =
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesStatus && matchesSearch;
});

  return (
    <div className="app">
    <h1>🌍 Trip Trail</h1>
    <Link to="/goals">Set Travel Goals</Link>
    {/* Search Bar */}
    <SearchBar onSearch={setSearchTerm} />

    {/* Filter Panel */}
    <FilterPanel
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />

    {/* Filtered Destination List or Message */}
    {filteredDestinations.length > 0 ? (
      <DestinationList
        destinations={filteredDestinations}
        onToggleStatus={handleToggleStatus}
      />
    ) : (
      <p>No destinations match your search or filter.</p>
    )}

    {/* Add New Destination Form */}
    <DestinationForm onAdd={handleAddDestination} />
  </div>
  );
}

export default App;

