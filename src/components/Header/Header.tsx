import React from "react";
import { NavLink } from "react-router";
import './Header.css';
import {
  RepositorySelectionContext,
  useSelected,
} from "../../contexts/SelectionContexts.ts"

type PanelButton = {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};

type HeaderProps = {
    panelButtons?: PanelButton[];
};

function Header({ panelButtons = [] }: HeaderProps) {
    const repository = useSelected(RepositorySelectionContext);
    return (
        <header className="header">
            <div className="header-title">RDA Visualisation App: {repository ? repository.info.name : ""}</div>
            <nav className="header-nav">
                <ul className="nav-list">
                    <li><NavLink to="/documentation">Documentation</NavLink></li>
                </ul>
                {panelButtons?.map(btn => (
                    <PanelButton key={btn.id} {...btn}/>
                ))}
            </nav>
        </header>
    );
}

function PanelButton({icon, label, onClick}: PanelButton) {
    return (
        <div className="panel-button">
            <button title={label} onClick={onClick}><span className="icon">{icon}</span><span className="label">{label}</span></button>
        </div>
    )
}


export default Header;
