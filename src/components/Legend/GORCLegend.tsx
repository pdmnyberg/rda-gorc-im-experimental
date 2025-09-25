import React from "react";
import "./GORCLegend.css";

export const GORCLegend: React.FC = () => {
    return (
        <aside className="gorc-legend" aria-label="Legend">
            <div className="gorc-legend-title">Legend</div>

            <div className="gorc-legend-section">
                <div className="gorc-legend-row">
                    <span className="gorc-legend-dot dot-core" />
                    <span className="gorc-legend-label">Core</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-dot dot-desirable" />
                    <span className="gorc-legend-label">Desirable</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-dot dot-optional" />
                    <span className="gorc-legend-label">Optional</span>
                </div>
            </div>

            <hr />

            <div className="gorc-legend-section">
                <div className="gorc-legend-row">
                    <span className="gorc-legend-icon icon-category" />
                    <span className="gorc-legend-label">Category</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-icon icon-subcategory" />
                    <span className="gorc-legend-label">Subcategory</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-icon icon-attribute" />
                    <span className="gorc-legend-label">Attribute</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-icon icon-feature" />
                    <span className="gorc-legend-label">Feature</span>
                </div>
                <div className="gorc-legend-row">
                    <span className="gorc-legend-icon icon-essential-element" />
                    <span className="gorc-legend-label">Essential Element</span>
                </div>
            </div>
        </aside>
    );
};

