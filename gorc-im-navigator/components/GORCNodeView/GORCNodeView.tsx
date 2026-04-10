import { Handle, Position } from "@xyflow/react";
import { GORCNode } from "../../modules/GORCNodes";
import "./GORCNodeView.css";
import { useNodeSelection } from "../../contexts/SelectionContexts";

type Props = {
  data: GORCNode;
};

export function GORCNodeView({ data }: Props) {
  const nodeSelection = useNodeSelection();
  const selectedNode = nodeSelection[0]
  return (
    <div
      className={`gorc-node-root${selectedNode && data.id === selectedNode.id ? " selected" : ""}`}
      data-type={data.type}
      data-consideration-level={data.considerationLevel}
    >
      <Handle
        className="gorc-node-handle"
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <div className="gorc-node-body">
        <div className="gorc-node-shape">
          <div
            className="gorc-node-icon"
            style={
              data.icon ? { "--gorc-icon": `url(${data.icon})` } as React.CSSProperties : undefined
            }
          />
        </div>
        <div className="gorc-node-text">{data.name}</div>
      </div>
      <Handle
        className="gorc-node-handle"
        type="source"
        position={Position.Top}
        id="a"
        isConnectable={false}
      />
    </div>
  );
}
