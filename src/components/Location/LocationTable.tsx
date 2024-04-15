import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Location.css';
import Sidebar from '../sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaTimes , FaSortAlphaDownAlt} from 'react-icons/fa';

interface City {
  geoname_id: string;
  name: string;
  cou_name_en: string;
  timezone: number;
  coordinates: {
    lon: number;
    lat: number;
  };
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof City;
  direction: SortDirection;
}

const LocationTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    filterCities();
  }, [searchInput, cities]);

  useEffect(() => {
    if (sortConfig !== null) {
      const sortedCities = [...cities].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setCities(sortedCities);
    }
  }, [sortConfig, cities]);

  const fetchCities = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get<any>(
        'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&timezone=Asia%2Fkolkata&refine=cou_name_en%3A%22India%22'
      );
      setCities(response.data.results);
      setError(null);
    } catch (error) {
      setError('Error fetching cities');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCities = () => {
    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleCitySelection = (lat: number, lon: number, name : string) => {
    navigate(`/weatherinfo`, { state: { lat, lon , name  } });
    setSearchInput('');
    setShowAutocomplete(false);
  };

  const requestSort = (key: keyof City) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className='di'>
        <h1 className='st'>Infinite scroll - Weather Forecast Web Application</h1>
      </div>
      <Sidebar />
       
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">City Locations</h2>
        <div className="search-bar-container">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="search-bar"
            onFocus={() => setShowAutocomplete(true)}
          />
          {searchInput && (
            <button className="clear-icon" onClick={() => setSearchInput('')}>
              <FaTimes />
            </button>
          )}
          {showAutocomplete && searchInput && (
            <div className="autocomplete">
              {filteredCities.map(city => (
                <div
                  key={city.geoname_id}
                  className="autocomplete-item"
                  style={{cursor: 'pointer'}}
                  onClick={() => handleCitySelection(city.coordinates.lat, city.coordinates.lon, city.name)}
                >
                  {city.name}, {city.cou_name_en}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="location-table-container" ref={containerRef} style={{ overflowY: 'scroll', height: '500px'}}>
          <table className="table-auto w-full">
            <thead>
              <FaSortAlphaDownAlt style={{position : 'absolute', left: '35%', top: '15px', cursor: 'pointer'}} onClick={() => requestSort('name')}/>
              <FaSortAlphaDownAlt style={{position : 'absolute', left: '68%', top: '15px', cursor: 'pointer'}} onClick={() => requestSort('cou_name_en')}/>
              <FaSortAlphaDownAlt style={{position : 'absolute', left: '97%', top: '15px', cursor: 'pointer'}} onClick={() => requestSort('timezone')}/>
              <tr>
                <th className="px-4 py-2" onClick={() => requestSort('name')}>City Name</th>
                <th className="px-4 py-2" onClick={() => requestSort('cou_name_en')}>Country Code</th>
                <th className="px-4 py-2" onClick={() => requestSort('timezone')}>Time Zone</th>
              </tr>
            </thead>
            <tbody >
              {cities.map((city, index) => (
                <tr key={index} className="border-b border-gray-200" onClick={() => handleCitySelection(city.coordinates.lat, city.coordinates.lon, city.name)}>
                  <td className="px-4 py-2">
                    <Link to={'/weatherinfo'} className="text-blue-500 hover:text-blue-700" style={{textDecoration: 'none', color: 'black'}}>
                      {city.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2" style={{textDecoration: 'none', color: 'black' }}>{city.cou_name_en}</td>
                  <td className="px-4 py-2">{city.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>
      </div>
      <div style={{ paddingTop: '75.000%', position: 'relative' }}>
        <iframe
          src="https://gifer.com/embed/RS5V"
          width="85%"
          height="10%"
          style={{ position: 'absolute', top: -572, left: 250 }}
        ></iframe>
      </div>
    </>
  );
};

export default LocationTable;
