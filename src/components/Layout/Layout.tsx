import React from 'react';
import './Layout.css';

type Props = React.PropsWithChildren<{
    settings?: React.ReactNode;
    header: React.ReactNode;
}>;

const Layout: React.FC<Props> = ({ children, settings, header }) => {
    const [showSettings, setShowSetting] = React.useState(false);
    return (
        <div className="layout">
            <header>
                {header}
                <div className="settings-button" onClick={() => setShowSetting(!showSettings)}></div>
            </header>
            <main>
                {children}
                <aside className="settings" data-visible={showSettings}>
                    <div className="settings-container">
                        {settings}
                    </div>
                </aside>
            </main>
            <footer>
                <small>NBIS development</small>
            </footer>
        </div>
    );
};

export default Layout;
