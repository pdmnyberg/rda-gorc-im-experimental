import React from 'react';
import './Layout.css';
import Header from "../Header/Header";

type Panel = {
    component: React.ReactNode,
    icon: React.ReactNode;
    label: string;
}

type Props = React.PropsWithChildren<{
    panels?: Record<string, Panel>;
}>;

const Layout: React.FC<Props> = ({ children, panels = {} }) => {
    const [currentPanel, setCurrentPanel] = React.useState<string | null>(null);

    const panelButtons = Object.entries(panels).map(([id, panel]) => ({
        id,
        icon: panel.icon,
        onClick: () => setCurrentPanel(currentPanel === id ? null : id),
        label: panel.label,
    }));

    return (
        <div className="layout">
            <Header panelButtons={panelButtons} />
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
