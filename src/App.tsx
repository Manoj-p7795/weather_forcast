import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationTable from './components/Location/LocationTable';
import WeatherInfo from './components/Weather/WeatherInfo';
import Sidebar from './components/sidebar/Sidebar';

const App: React.FC = () => {
  
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<LocationTable />} />
        <Route path="/weatherinfo" element={<WeatherInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
