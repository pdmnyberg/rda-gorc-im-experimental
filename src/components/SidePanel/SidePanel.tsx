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
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayedNode, setDisplayedNode] = React.useState<typeof node>(null);

  React.useEffect(() => {
    if (node) {
      setDisplayedNode(node);
      setIsOpen(true);
    }
  }, [node]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setDisplayedNode(null);
      onClose();
    }, 100);
  };

  const data = displayedNode?.data;

  return (
    <PanelWrapper position="left" visible={isOpen}>
      <button
        className="side-panel-close"
        onClick={handleClose}
        aria-label="Close panel"
      >
        ×
      </button>
      {displayedNode ? (
        data ? (
          <>
            <h2>{data.shortName}</h2>
            <h3>{data.name}</h3>
            <p className="data-type">{data.type}</p>
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
        )
      ) : (
        (null as React.ReactNode)
      )}
    </PanelWrapper>
  );
};
