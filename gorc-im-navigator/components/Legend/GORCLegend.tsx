import React from "react";
import "./GORCLegend.css";

type LegendItem = {label: string; type: "shape" | "color", id: string}

export function GORCLegend({style}: {style?: React.CSSProperties}) {
  const items: LegendItem[] = [
    ...([
        "Core",
        "Desirable",
        "Optional"].map<LegendItem>(c => ({id: c.toLowerCase(), label: c, type: "color"}))),
    ...([
        "Essential Element",
        "Category",
        "Subcategory",
        "Attribute",
        "Feature"
    ].map<LegendItem>(c => ({id: c.toLowerCase().replaceAll(" ", "-"), label: c, type: "shape"})))
  ]
  return (
    <div className="card d-block" style={style} aria-label="Legend">
      <div className="card-header">
       Legend
      </div>
      <ul className="list-group list-group-flush">
      {items.filter(i => i.type === "color").map(i => (
        <li className="list-group-item gorc-legend-row" key={i.id}>
          <span className={`gorc-legend-dot dot-${i.id}`} />
          <span className="gorc-legend-label">{i.label}</span>
        </li>
      ))}
      {items.filter(i => i.type === "shape").map(i => (
        <li className="list-group-item gorc-legend-row" key={i.id}>
          <span className={`gorc-legend-icon icon-${i.id}`} />
          <span className="gorc-legend-label">{i.label}</span>
        </li>
      ))}
      </ul>
    </div>
  )
};

