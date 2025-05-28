import React from 'react';
import './Layout.css';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>RDA Visualisation App</h1>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <small>NBIS development</small>
            </footer>
        </div>
    );
};

export default Layout;
