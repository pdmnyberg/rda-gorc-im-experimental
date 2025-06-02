import React from 'react';
import './Layout.css';

type Panel = {
    component: React.ReactNode,
    icon: React.ReactNode;
}

type Props = React.PropsWithChildren<{
    panels?: Record<string, Panel>;
    header: React.ReactNode;
}>;

const Layout: React.FC<Props> = ({ children, header, ...props}) => {
    const [currentPanel, setCurrentPanel] = React.useState<string | null>(null);
    const panels = props.panels || {};
    return (
        <div className="layout">
            <header>
                {header}
                {Object.keys(panels).map((panelId) => {
                    const panel = panels[panelId];
                    const targetPanel = panelId === currentPanel ? null : panelId;
                    return (
                        <div key={panelId} className="panel-button" onClick={() => setCurrentPanel(targetPanel)}>{panel.icon}</div>
                    )
                })}
            </header>
            <main>
                {children}
                {Object.keys(panels).map((panelId) => {
                    const panel = panels[panelId];
                    return (
                        <aside key={panelId} className="panel" data-visible={currentPanel === panelId}>
                            <div className="panel-container">
                                {panel.component}
                            </div>
                        </aside>
                    )
                })}
            </main>
            <footer>
                <small>NBIS development</small>
            </footer>
        </div>
    );
};

export default Layout;
