import { Handle, Position } from "@xyflow/react";
import { GORCNode } from "../../modules/GORCNodes";
import "./GORCNodeView.css";

type Props = {
  data: GORCNode & { isSelected?: boolean };
};

export function GORCNodeView({ data }: Props) {
  return (
    <div
      className={`gorc-node-root${data.isSelected ? " selected" : ""}`}
      data-type={data.type}
      data-consideration-level={data.considerationLevel}
    >
      <Handle
        className="groc-node-handle"
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <div className="gorc-node-body">
        <div className="gorc-node-shape">
          <div
            className="gorc-node-icon"
            style={
              { "--gorc-icon": `url(${data.icon})` } as React.CSSProperties
            }
          />
        </div>
        <div className="gorc-node-text">{data.name}</div>
      </div>
      <Handle
        className="groc-node-handle"
        type="source"
        position={Position.Top}
        id="a"
        isConnectable={false}
      />
    </div>
  );
}
