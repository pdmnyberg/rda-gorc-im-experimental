import { KPI } from "../../modules/GORCNodes";
import "./SidePanel.css";
import { PanelWrapper } from "../PanelWrapper/PanelWrapper";
import React from "react";
import { useModel } from "../../contexts/ModelContext";
import { NodeSelectionManager } from "../../contexts/SelectionContexts";

type Props = {
  onClose: () => void;
};

function BadgeGroup({type, value, badgeType}: {type: string, value: string, badgeType?: string}) {
  badgeType = badgeType || value
  return (
    <span className="badge-group">
      <span className="badge-type">{type}</span><span className={`badge ${badgeType}`}>{value}</span>
    </span>
  )
}

export const SidePanel = ({ onClose }: Props) => {
  const nodeSelection = React.useContext(NodeSelectionManager);
  const node = nodeSelection[0]
  const setNode = nodeSelection[2]

  const [isOpen, setIsOpen] = React.useState(false);
  const modelDefintion = useModel();

  React.useEffect(() => {
    if (node) {
      setIsOpen(true);
    }
  }, [node]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
    setTimeout(() => {
      setNode(null);
    }, 100);
  };

  const kpiNodes = React.useMemo(() => (
    node ? modelDefintion.nodes.filter((n): n is KPI => ["kpi", "metric"].includes(n.type)).filter(kpi => kpi.measurementOf.includes(node.id) || kpi.indicatorOf.includes(node.id)) : []
  ), [modelDefintion.nodes, node]);

  const parent = React.useMemo(() => (
    node && "childOf" in node ? modelDefintion.nodes.filter((n) => n.id === node.childOf)[0] : null
  ), [modelDefintion.nodes, node])
  const childNodes = React.useMemo(() => (
    node ? modelDefintion.nodes.filter((n) => "childOf" in n && n.childOf === node.id) : []
  ), [modelDefintion.nodes, node])

  return (
    <PanelWrapper position="left" visible={isOpen}>
      <button
        className="side-panel-close"
        onClick={handleClose}
        aria-label="Close panel"
      >
        ×
      </button>
      {node ? (
        <>
          <h2>{node.shortName}</h2>
          <h3>{node.name}</h3>
          <p className="data-type">{node.type}</p>
          {node.description && <p>{node.description}</p>}
          <BadgeGroup type="Consideration Level" value={node.considerationLevel} />

          <hr />
          {parent ? <>
            <h3>Parent</h3>
            <ul>
              <li>
                <a className="node-link" onClick={() => setNode(parent)}>{parent.name}</a>
                <BadgeGroup type="Type" value={parent.type} badgeType={parent.considerationLevel} />
                <BadgeGroup type="Consideration Level" value={parent.considerationLevel} />
              </li>
            </ul>
          </> : <></>}
          {childNodes.length ? <>
            <h3>Children</h3>
            <ul>
              {childNodes.map(n => (
                  <li key={n.id}>
                    <a className="node-link" onClick={() => setNode(n)}>{n.name}</a>
                    <BadgeGroup type="Type" value={n.type} badgeType={n.considerationLevel} />
                    <BadgeGroup type="Consideration Level" value={n.considerationLevel} />
                  </li>
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
        (null as React.ReactNode)
      )}
    </PanelWrapper>
  );
};
