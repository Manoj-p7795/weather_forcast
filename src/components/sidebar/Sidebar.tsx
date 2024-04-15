import React from 'react';
import { Link } from 'react-router-dom';
import { Home, WbSunny } from '@mui/icons-material';
import "./sidebar.css";

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="p-4 flex items-center">
                <img src="https://pragativadi.com/wp-content/uploads/2022/07/SAVE_20220703_084840.jpg" alt="Weather Icon" className="w-8 h-8 mr-2" style={{position : "absolute" , width: "250px"}} />
                {/* <h1 className="text-lg font-bold" style={{position: "relative", top: "115%"}}>Web Application</h1> */}
            </div>
            <ul className="flex-1">
                <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                    <Home className="mr-2" />
                    <Link to="/" className="block"> Cities List</Link>
                </li>
            </ul>
            <div className="footer">
            <p>&copy; Manoj Kumar P</p>
            </div>
        </div>
    );
};

export default Sidebar;
