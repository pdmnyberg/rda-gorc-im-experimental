import type { Node } from "@xyflow/react";
import { GORCNode, KPI } from "../../modules/GORCNodes";
import "./SidePanel.css";
import { PanelWrapper } from "../PanelWrapper/PanelWrapper";
import React from "react";
import { useModel } from "../../contexts/ModelContext";

type Props = {
  node: Node<GORCNode> | null;
  onClose: () => void;
};

function BadgeGroup({type, value}: {type: string, value: string}) {
  return (
    <span className="badge-group">
      <span className="badge-type">{type}</span><span className={`badge ${value}`}>{value}</span>
    </span>
  )
}

export const SidePanel = ({ node, onClose }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayedNode, setDisplayedNode] = React.useState<typeof node>(null);
  const modelDefintion = useModel();

  React.useEffect(() => {
    if (node) {
      setDisplayedNode(node);
      setIsOpen(true);
    }
  }, [node]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
    setTimeout(() => {
      setDisplayedNode(null);
    }, 100);
  };

  const data = displayedNode?.data;
  const kpiNodes = React.useMemo(() => (
    data ? modelDefintion.nodes.filter((n): n is KPI => ["kpi", "metric"].includes(n.type)).filter(kpi => kpi.measurementOf.includes(data.id) || kpi.indicatorOf.includes(data.id)) : []
  ), [modelDefintion.nodes, data]);

  const parent = React.useMemo(() => (
    data && "childOf" in data ? modelDefintion.nodes.filter((n) => n.id === data.childOf)[0] : null
  ), [modelDefintion.nodes, data])
  const childNodes = React.useMemo(() => (
    data ? modelDefintion.nodes.filter((n) => "childOf" in n && n.childOf === data.id) : []
  ), [modelDefintion.nodes, data])

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
            <BadgeGroup type="Consideration Level" value={data.considerationLevel} />

            <hr />
            {parent ? <>
              <h3>Parent</h3>
              <ul>
                <li>{parent.name} <BadgeGroup type="Consideration Level" value={parent.considerationLevel} /></li>
              </ul>
            </> : <></>}
            {childNodes.length ? <>
              <h3>Children</h3>
              <ul>
                {childNodes.map(n => (
                    <li key={n.id}>{n.name} <BadgeGroup type="Consideration Level" value={n.considerationLevel} /></li>
                  ))}
              </ul>
            </> : <></>}

            <hr />
            {[{type: "kpi", label: "KPIs"}, {type: "metric", label: "Metrics"}].map(({type, label}) => {
              const filteredNodes = kpiNodes.filter(n => n.type === type)
              return filteredNodes.length > 0 ? (
                <React.Fragment key={type}>
                  <h3>{label}</h3>
                  <ul>
                    {filteredNodes.map(n => (
                      <li key={n.id}>{n.name} <BadgeGroup type="Consideration Level" value={n.considerationLevel} /></li>
                    ))}
                  </ul>
                </React.Fragment>
              ) : <React.Fragment key={type}></React.Fragment>
            })}
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
