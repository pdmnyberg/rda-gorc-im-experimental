import {BaseModel, ModelProfile, ThematicSlice, ModelNode} from "../src/modules/LayeredModel";

export const baseModel: BaseModel = {
    version: "0.1.0",
    id: "gorc-im-base",
    label: "GORC Base Model",
    nodes: [
        /**
         * These are the essential elements of the base GORC model
         */
        {
            id: "governance-and-leadership",
            type: "essential-element",
            icon: "icons/groc-icon_governance-and-leadership.svg",
            name: "Governance & Leadership",
            shortName: "G & L",
            considerationLevel: "core",
            description: "Stakeholders that define the commons purpose and the development of the strategies, objectives, values, and policies that frame how that purpose will be pursued.",
            shortDescription: "Stakeholders who define the commons' purpose and direction.",
        },
        {
            id: "rules-of-participation-and-access",
            type: "essential-element",
            icon: "icons/groc-icon_rules-of-participation-and-access.svg",
            name: "Rules of Participation & Access",
            shortName: "RoP & A",
            considerationLevel: "core",
            description: "A set of policies defining a minimal set of rights, obligations, and accountability governing the activities of those participating in the commons."
        },
        {
            id: "sustainability",
            type: "essential-element",
            icon: "icons/groc-icon_sustainability.svg",
            name: "Sustainability",
            shortName: "S",
            considerationLevel: "core",
            description: "Models and agreements made on how to fund or resource activities in a way that can be sustained over the long term."
        },

        /**
         * These are categories of Governance & Leadership
         */
        {
            id: "commons-strategic-planning",
            type: "category",
            parentId: "governance-and-leadership",
            name: "Commons Strategic Planning",
            shortName: "CSP",
            considerationLevel: "core",
            description: "i.e. including governance structure, stakeholder strategy, sustainable operational strategy, and a strategy for the future"
        },
        {
            id: "commons-intent-and-definition",
            type: "category",
            parentId: "governance-and-leadership",
            name: "Commons intent and definition",
            shortName: "CID",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "governance-of-quality-research",
            type: "category",
            parentId: "governance-and-leadership",
            name: "Governance* rules, principles, and enforcement of quality for Research Object*s and Services* & Tools*",
            shortName: "Governance of quality Research",
            considerationLevel: "core",
            description: "i.e. Research Object* ethics, including data ethics"
        },
        {
            id: "internal-commons-policy",
            type: "category",
            parentId: "governance-and-leadership",
            name: "Internal Commons* Policy Development, implementation, and review",
            shortName: "Internal Commons Policy",
            considerationLevel: "core",
            description: "May be in the form of policies, guidelines, and/or standard operating procedures (SOP)"
        },
        {
            id: "organizational-structure",
            type: "category",
            parentId: "governance-and-leadership",
            name: "Organizational structures, designs, ways of working, and capability maturity level for the aims and context of the commons",
            shortName: "Organizational structure",
            considerationLevel: "core",
            description: "Including a clear definition of working relationships between governance* and management"
        },

        /**
         * Commons Strategic Planning
         */

        {
            id: "community-relations",
            type: "attribute",
            parentId: "commons-strategic-planning",
            name: "Development and implementation of community* relations",
            shortName: "",
            considerationLevel: "core",
            description: "i.e. Engagement* with stakeholders on matters that affect them and Shareholder relations (if applicable)"
        },
        {
            id: "development-strategy",
            type: "attribute",
            parentId: "commons-strategic-planning",
            name: "Development of strategy",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "risk-management",
            type: "subcategory",
            parentId: "commons-strategic-planning",
            name: "Risk Management Frameworks",
            shortName: "",
            considerationLevel: "optional",
            description: ""
        },
        {
            id: "policy-advocacy",
            type: "subcategory",
            parentId: "commons-strategic-planning",
            name: "Policy advocacy, and recommendations",
            shortName: "",
            considerationLevel: "optional",
            description: ""
        },
        {
            id: "funding-and-resourcing",
            type: "subcategory",
            parentId: "commons-strategic-planning",
            name: "Funding and Resourcing Frameworks",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "relevant-roadmaps",
            type: "feature",
            parentId: "development-strategy",
            name: "Development of relevant roadmaps",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "strategic-review",
            type: "feature",
            parentId: "development-strategy",
            name: "Regular strategic review and alignment exercises",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "strategic-planning",
            type: "feature",
            parentId: "development-strategy",
            name: "Strategic planning influences and approaches",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "performance-metrics",
            type: "feature",
            parentId: "development-strategy",
            name: "Development of organizational performance and capability metrics*",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "organizational-monitoring",
            type: "feature",
            parentId: "development-strategy",
            name: "A monitoring organizational design or organizational performance system to gather qualitative and quantitative metrics*",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "develop-risk-management",
            type: "attribute",
            parentId: "risk-management",
            name: "Development of risk management frameworks",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "implement-risk-management",
            type: "attribute",
            parentId: "risk-management",
            name: "Implementation and operationalization of risk management frameworks",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "risk-identification",
            type: "attribute",
            parentId: "risk-management",
            name: "Identification of risks and issues",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "financial-requirements",
            type: "attribute",
            parentId: "funding-and-resourcing",
            name: "Identification of the financial and resource requirements for commons* activities",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "added-value",
            type: "attribute",
            parentId: "funding-and-resourcing",
            name: "Demonstration of added value",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "business-continuity",
            type: "feature",
            parentId: "develop-risk-management",
            name: "Business continuity planning",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "human-rights",
            type: "feature",
            parentId: "develop-risk-management",
            name: "Human rights risk identification and management",
            shortName: "",
            considerationLevel: "optional",
            description: ""
        },
        {
            id: "technology-planning",
            type: "feature",
            parentId: "develop-risk-management",
            name: "Technology and information governance* planning",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "health-planning",
            type: "feature",
            parentId: "develop-risk-management",
            name: "Health and safety governance* planning",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "environmental-considerations",
            type: "feature",
            parentId: "financial-requirements",
            name: "Environmental considerations",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "governance-considerations",
            type: "feature",
            parentId: "financial-requirements",
            name: "Governance* considerations",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        {
            id: "social-considerations",
            type: "feature",
            parentId: "financial-requirements",
            name: "Social considerations",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        /*
        "": {
            type: "feature",
            parentId: "",
            name: "",
            shortName: "",
            considerationLevel: "core",
            description: ""
        },
        */

        /**
         * These are categories of Rules of Participation and Access
         */
        {
            id: "minimal-set-of-rights-and-obligations",
            type: "category",
            parentId: "rules-of-participation-and-access",
            name: "A set of policies defining a minimal set of rights and obligations for the commons* community",
            shortName: "A minimal set of rights and obligations definition",
            considerationLevel: "core",
            description: "May be a singular policy document with several sections addressing different aspects of rights and obligations, or several specific policies. May also be grouped with accountability in a larger rules of participation and access document for the commons."
        },
        {
            id: "minimal-accountability",
            type: "category",
            parentId: "rules-of-participation-and-access",
            name: "A set of policies defining minimal accountability for the commons* community",
            shortName: "Minimal accountability defintion",
            considerationLevel: "core",
            description: "May be a singular policy document with several sections addressing different aspects of accountability, or several specific policies. May also be grouped with rights and obligations in a larger rules of participation and access document for the commons."
        },
    ]
}

function getRoot(node: ModelNode, nodes: ModelNode[]) {
    const nodeMap = nodes.reduce<Record<string, ModelNode>>((acc, n) => {acc[n.id] = n; return acc;}, {});
    let currentNode = node;
    while ("parentId" in currentNode) {
        currentNode = nodeMap[currentNode.parentId]
    }
    return currentNode.id;
}

export const onlyGoLProfile: ModelProfile = {
    version: "0.1.0",
    id: "gorc-im-only-gol",
    label: "GORC Only Governance & Leadership",
    nodes: baseModel.nodes.filter(
            node => getRoot(node, baseModel.nodes) !== "governance-and-leadership"
        ).map(node => ({
            type: "nothing", id: node.id
        })
    )
}

export const onlySustainabilityProfile: ModelProfile = {
    version: "0.0.1",
    id: "gorc-im-only-sustainability",
    label: "GORC Only Sustainability",
    nodes: baseModel.nodes.filter(
            node => getRoot(node, baseModel.nodes) !== "sustainability"
        ).map(node => ({
            type: "nothing", id: node.id
        })
    )
}

export const onlyRoPaAProfile: ModelProfile = {
    version: "0.0.1",
    id: "gorc-im-only-ropaa",
    label: "GORC Only Rules of Participation & Access",
    nodes: baseModel.nodes.filter(
            node => getRoot(node, baseModel.nodes) !== "rules-of-participation-and-access"
        ).map(node => ({
            type: "nothing", id: node.id
        })
    )
}

export const onlyGoLSlice: ThematicSlice = {
    version: "0.1.0",
    id: "gorc-im-gol-slice",
    label: "GORC Governance & Leadership Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "governance-and-leadership"
    ).map(n => ({nodeId: n.id}))
}

export const onlySustainabilitySlice: ThematicSlice = {
    version: "0.1.0",
    id: "gorc-im-sustainability-slice",
    label: "GORC Sustainability Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "sustainability"
    ).map(n => ({nodeId: n.id}))
}

export const onlyRoPaASlice: ThematicSlice = {
    version: "0.1.0",
    id: "gorc-im-ropaa-slice",
    label: "GORC Rules of Participation & Access Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "rules-of-participation-and-access"
    ).map(n => ({nodeId: n.id}))
}

export const models = {
    baseModel,
}

export const profiles = {
    onlyGoLProfile,
    onlySustainabilityProfile,
    onlyRoPaAProfile
}

export const slices = {
    onlyGoLSlice,
    onlySustainabilitySlice,
    onlyRoPaASlice
}
