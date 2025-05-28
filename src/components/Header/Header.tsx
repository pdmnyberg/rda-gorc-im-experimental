import React from "react";
import { NavLink } from "react-router";
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-title">RDA Visualisation App</div>
            <nav className="header-nav">
                <ul className="nav-list">
                    <li><NavLink to="/documentation">Documentation</NavLink></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
