import React from "react";
import "./PanelWrapper.css";

type Props = {
  children: React.ReactNode;
  position: "left" | "right";
  visible?: boolean;
};

export const PanelWrapper = ({ children, position, visible = true }: Props) => (
  <div
    className={`panel-wrapper panel-wrapper--${position}`}
    data-visible={visible}
  >
    {children}
  </div>
);
