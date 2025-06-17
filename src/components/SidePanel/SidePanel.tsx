import type { Node } from "@xyflow/react";
import { GORCNode } from "../../modules/GORCNodes";
import "./SidePanel.css";
import { PanelWrapper } from "../PanelWrapper/PanelWrapper";
import React from "react";

type Props = {
  node: Node<GORCNode> | null;
  onClose: () => void;
};

export const SidePanel = ({ node, onClose }: Props) => {
  if (!node) return null;

  const data = node.data;

  return (
    <PanelWrapper position={"left"}>
      <button
        className="side-panel-close"
        onClick={onClose}
        aria-label="Close panel"
      >
        ×
      </button>
      {data ? (
        <>
          <h2>{data.shortName}</h2>
          <h3>{data.name}</h3>
          <p className="data-type"> {data.type}</p>
          {data.description && <p>{data.description}</p>}
          <p>
            Consideration Level
            <span className={`badge ${data.considerationLevel}`}>
              {data.considerationLevel}
            </span>
          </p>
        </>
      ) : (
        "No data available"
      )}
    </PanelWrapper>
  );
};
