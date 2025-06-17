import React from "react";
import "./PanelWrapper.css";

type Props = {
  children: React.ReactNode;
  position: "left" | "right";
};

export const PanelWrapper = ({ children, position }: Props) => (
  <div className={`side-panel ${position}`}>{children}</div>
);
