import { GORCNode, KPI } from "../modules/GORCNodes";
import React from "react";
import { useModel } from "../contexts/ModelContext";

type UIColor = (
  "primary" |
  "secondary" |
  "success" |
  "danger" |
  "warning" |
  "info" |
  "light" |
  "dark" |
  "core" |
  "desirable" |
  "optional"
)

type BadgeGroupProps = {
  color?: UIColor,
  type: string,
  value: string,
}

function BadgeGroup({type, value, color}: BadgeGroupProps) {
  color = color || "primary";
  return (
    <span className={`badge rounded-pill text-bg-${color} mx-1`}>
      <span className="text-capitalize">{type}</span>: <span className="text-capitalize">{value}</span>
    </span>
  )
}

export const NodeInfoPanel = ({node, setNode}: {node: GORCNode | null, setNode: (n: GORCNode | null) => void}) => {
  const modelDefintion = useModel();
  const kpiNodes = React.useMemo(() => (
    node ? modelDefintion.nodes.filter((n): n is KPI => ["kpi", "metric"].includes(n.type)).filter(kpi => kpi.measurementOf.includes(node.id) || kpi.indicatorOf.includes(node.id)) : []
  ), [modelDefintion.nodes, node]);

  const parent = React.useMemo(() => (
    node && "childOf" in node ? modelDefintion.nodes.filter((n) => n.id === node.childOf)[0] : null
  ), [modelDefintion.nodes, node])
  const childNodes = React.useMemo(() => (
    node ? modelDefintion.nodes.filter((n) => "childOf" in n && n.childOf === node.id) : []
  ), [modelDefintion.nodes, node])

  return node ? (
    <>
      {node.name !== node.shortName ? <h6>{node.name}</h6> : <></>}
      <p className="data-type">{node.type}</p>
      {node.description && <p>{node.description}</p>}
      <BadgeGroup type="Consideration Level" value={node.considerationLevel} color={node.considerationLevel} />
      <hr />
      {parent ? <>
        <h6>Parent</h6>
        <ul>
          <li>
            <a className="node-link" onClick={() => setNode(parent)}>{parent.name}</a>
            <BadgeGroup type="Type" value={parent.type} color="info" />
            <BadgeGroup type="Consideration Level" color={parent.considerationLevel} value={parent.considerationLevel} />
          </li>
        </ul>
      </> : <></>}
      {childNodes.length ? <>
        <h6>Children</h6>
        <ul>
          {childNodes.map(n => (
              <li key={n.id}>
                <a className="node-link" onClick={() => setNode(n)}>{n.name}</a>
                <BadgeGroup type="Type" value={n.type} color="info" />
                <BadgeGroup type="Consideration Level" color={n.considerationLevel} value={n.considerationLevel} />
              </li>
            ))}
        </ul>
      </> : <></>}

      <hr />
      {[{type: "kpi", label: "KPIs"}, {type: "metric", label: "Metrics"}].map(({type, label}) => {
        const filteredNodes = kpiNodes.filter(n => n.type === type)
        return filteredNodes.length > 0 ? (
          <React.Fragment key={type}>
            <h6>{label}</h6>
            <ul>
              {filteredNodes.map(n => (
                <li key={n.id}>{n.name} <BadgeGroup type="Consideration Level" color={n.considerationLevel} value={n.considerationLevel} /></li>
              ))}
            </ul>
          </React.Fragment>
        ) : <React.Fragment key={type}></React.Fragment>
      })}
    </>
  ) : (
    <></>
  )
};
