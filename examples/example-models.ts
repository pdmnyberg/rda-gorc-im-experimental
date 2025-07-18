import { BaseModel, ModelProfile, ThematicSlice, ModelNode } from "../src/modules/LayeredModel";

export const ossModel: BaseModel = {
    version: "0.1.0",
    id: "oss-base",
    label: "OSS Base Model",
    nodes: [
        // --- Essential Element: Governance ---
        {
            id: "ee1",
            type: "essential-element",
            icon: "icons/compass.png",
            shortName: "Governance",
            name: "Project Governance",
            description: "Processes and roles that define how decisions are made in the project.",
            considerationLevel: "core"
        },
        {
            id: "cat1",
            parentId: "ee1",
            type: "category",
            shortName: "Leadership",
            name: "Leadership Structure",
            description: "Defines who leads and how leadership changes.",
            considerationLevel: "core"
        },
        {
            id: "attr1",
            parentId: "cat1",
            type: "attribute",
            shortName: "Decisions",
            name: "Decision-Making Process",
            description: "How key decisions are made, including voting or consensus mechanisms.",
            considerationLevel: "core"
        },
        {
            id: "feat1",
            parentId: "attr1",
            type: "feature",
            shortName: "Voting",
            name: "Voting Mechanisms",
            description: "Whether decisions are made by majority vote, consensus, etc.",
            considerationLevel: "core"
        },
        {
            id: "feat1b",
            parentId: "attr1",
            type: "feature",
            shortName: "Transparency",
            name: "Decision Transparency",
            description: "Availability of decision rationales and public logs.",
            considerationLevel: "core"
        },
        {
            id: "kpi1",
            parentId: "feat1",
            type: "kpi",
            shortName: "Participation",
            name: "Governance Participation Rate",
            description: "The percentage of eligible members participating in votes.",
            considerationLevel: "core"
        },
        {
            id: "kpi1b",
            parentId: "feat1",
            type: "kpi",
            shortName: "Timeliness",
            name: "Average Decision Time",
            description: "Average time taken to reach a decision from proposal to resolution.",
            considerationLevel: "optional"
        },

        // --- Essential Element: Community Engagement ---
        {
            id: "ee2",
            type: "essential-element",
            icon: "icons/two-guys.png",
            shortName: "Community",
            name: "Community Engagement",
            description: "How contributors, users, and stakeholders engage with the project.",
            considerationLevel: "core"
        },
        {
            id: "attr2",
            parentId: "ee2",
            type: "attribute",
            shortName: "Onboarding",
            name: "Contributor Onboarding",
            description: "How new contributors are introduced to the project and its processes.",
            considerationLevel: "desirable"
        },
        {
            id: "feat2",
            parentId: "attr2",
            type: "feature",
            shortName: "Guide",
            name: "Contributor Guide",
            description: "Whether a contributor guide exists and how comprehensive it is.",
            considerationLevel: "desirable"
        },
        {
            id: "feat2b",
            parentId: "attr2",
            type: "feature",
            shortName: "Mentorship",
            name: "Mentorship Program",
            description: "Structured pairing of newcomers with experienced contributors.",
            considerationLevel: "optional"
        },
        {
            id: "kpi2",
            parentId: "feat2",
            type: "kpi",
            shortName: "Retention",
            name: "New Contributor Retention Rate",
            description: "Percentage of new contributors who remain active after 3 months.",
            considerationLevel: "optional"
        },
        {
            id: "kpi2b",
            parentId: "feat2",
            type: "kpi",
            shortName: "Guide Usage",
            name: "Contributor Guide Access Rate",
            description: "Frequency with which the contributor guide is accessed.",
            considerationLevel: "optional"
        },

        // --- Essential Element: Sustainability ---
        {
            id: "ee3",
            type: "essential-element",
            icon: "icons/money-bag.png",
            shortName: "Sustainability",
            name: "Project Sustainability",
            description: "Long-term viability including funding, resources, and project health.",
            considerationLevel: "core"
        },
        {
            id: "cat2",
            parentId: "ee3",
            type: "category",
            shortName: "Finance",
            name: "Financial Health",
            description: "Resources available to support ongoing development.",
            considerationLevel: "desirable"
        },
        {
            id: "subcat1",
            parentId: "cat2",
            type: "subcategory",
            shortName: "Funding",
            name: "Funding Sources",
            description: "Where the money comes from: sponsors, grants, donations.",
            considerationLevel: "desirable"
        },
        {
            id: "attr3",
            parentId: "subcat1",
            type: "attribute",
            shortName: "Grants",
            name: "Dependency on Grant Funding",
            description: "Extent to which project relies on grants for survival.",
            considerationLevel: "optional"
        },
        {
            id: "attr3b",
            parentId: "subcat1",
            type: "attribute",
            shortName: "Sponsors",
            name: "Sponsor Engagement",
            description: "How sponsors are acquired, retained, and acknowledged.",
            considerationLevel: "optional"
        },
        {
            id: "kpi3",
            parentId: "attr3",
            type: "kpi",
            shortName: "Funding $",
            name: "Annual Funding Amount",
            description: "Total financial contributions received annually.",
            considerationLevel: "optional"
        },
        {
            id: "kpi3b",
            parentId: "attr3b",
            type: "kpi",
            shortName: "Sponsorship Count",
            name: "Number of Active Sponsors",
            description: "Number of sponsors contributing financially in the current year.",
            considerationLevel: "optional"
        },

        // --- Essential Element: Interoperability ---
        {
            id: "ee4",
            type: "essential-element",
            icon: "icons/chain-link.png",
            shortName: "Interop",
            name: "Interoperability",
            description: "The ability of the project to integrate and function across systems.",
            considerationLevel: "core"
        },
        {
            id: "cat3",
            parentId: "ee4",
            type: "category",
            shortName: "Standards",
            name: "Standards and Protocols",
            description: "Use of and alignment with open standards and interfaces.",
            considerationLevel: "core"
        },
        {
            id: "subcat2",
            parentId: "cat3",
            type: "subcategory",
            shortName: "APIs",
            name: "API Design",
            description: "How well the APIs are designed for external consumption.",
            considerationLevel: "core"
        },
        {
            id: "attr4",
            parentId: "subcat2",
            type: "attribute",
            shortName: "API Docs",
            name: "API Documentation Quality",
            description: "Clarity and completeness of API documentation.",
            considerationLevel: "desirable"
        },
        {
            id: "attr4b",
            parentId: "subcat2",
            type: "attribute",
            shortName: "Versioning",
            name: "API Versioning Strategy",
            description: "How API changes are managed and communicated.",
            considerationLevel: "optional"
        },
        {
            id: "kpi4",
            parentId: "attr4",
            type: "kpi",
            shortName: "API Usage",
            name: "External API Usage Count",
            description: "Number of external integrations using the API.",
            considerationLevel: "core"
        },
        {
            id: "kpi4b",
            parentId: "attr4b",
            type: "kpi",
            shortName: "API Breaks",
            name: "Backward Compatibility Breaks",
            description: "Number of times backwards compatibility is broken in major releases.",
            considerationLevel: "optional"
        },

        // --- Essential Element: Adoption ---
        {
            id: "ee5",
            type: "essential-element",
            icon: "icons/rocket.png",
            shortName: "Adoption",
            name: "User and Market Adoption",
            description: "How the project is used and adopted in practice.",
            considerationLevel: "core"
        },
        {
            id: "cat4",
            parentId: "ee5",
            type: "category",
            shortName: "Reach",
            name: "Community and Market Reach",
            description: "Extent and diversity of the project's usage and audience.",
            considerationLevel: "core"
        },
        {
            id: "subcat3",
            parentId: "cat4",
            type: "subcategory",
            shortName: "Localization",
            name: "Internationalization and Localization",
            description: "Support for non-English languages and local deployment contexts.",
            considerationLevel: "optional"
        },
        {
            id: "attr5",
            parentId: "subcat3",
            type: "attribute",
            shortName: "Lang Support",
            name: "Language Support Breadth",
            description: "How many languages the project supports.",
            considerationLevel: "optional"
        },
        {
            id: "attr5b",
            parentId: "subcat3",
            type: "attribute",
            shortName: "Docs i18n",
            name: "Translated Documentation Availability",
            description: "Availability of documentation in non-English languages.",
            considerationLevel: "optional"
        },
        {
            id: "kpi5",
            parentId: "attr5",
            type: "kpi",
            shortName: "Locales",
            name: "Number of Supported Locales",
            description: "Count of fully supported languages/locales.",
            considerationLevel: "optional"
        },
        {
            id: "kpi5b",
            parentId: "attr5b",
            type: "kpi",
            shortName: "Docs Translated",
            name: "Percentage of Docs Translated",
            description: "Percent of documentation that has been translated.",
            considerationLevel: "optional"
        }
    ]
}

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
            icon: "icons/gorc-icon_governance-and-leadership.svg",
            name: "Governance & Leadership",
            shortName: "G & L",
            considerationLevel: "core",
            description: "Stakeholders that define the commons purpose and the development of the strategies, objectives, values, and policies that frame how that purpose will be pursued.",
            shortDescription: "Stakeholders who define the commons' purpose and direction.",
        },
        {
            id: "rules-of-participation-and-access",
            type: "essential-element",
            icon: "icons/gorc-icon_rules-of-participation-and-access.svg",
            name: "Rules of Participation & Access",
            shortName: "RoP & A",
            considerationLevel: "core",
            description: "A set of policies defining a minimal set of rights, obligations, and accountability governing the activities of those participating in the commons."
        },
        {
            id: "sustainability",
            type: "essential-element",
            icon: "icons/gorc-icon_sustainability.svg",
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
    const nodeMap = nodes.reduce<Record<string, ModelNode>>((acc, n) => { acc[n.id] = n; return acc; }, {});
    let currentNode = node;
    while ("parentId" in currentNode) {
        currentNode = nodeMap[currentNode.parentId]
    }
    return currentNode.id;
}

export const onlyGoLProfile: ModelProfile = {
    modelId: "gorc-im-base",
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
    modelId: "gorc-im-base",
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
    modelId: "gorc-im-base",
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
    modelId: "gorc-im-base",
    version: "0.1.0",
    id: "gorc-im-gol-slice",
    label: "GORC Governance & Leadership Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "governance-and-leadership"
    ).map(n => ({ nodeId: n.id }))
}

export const onlySustainabilitySlice: ThematicSlice = {
    modelId: "gorc-im-base",
    version: "0.1.0",
    id: "gorc-im-sustainability-slice",
    label: "GORC Sustainability Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "sustainability"
    ).map(n => ({ nodeId: n.id }))
}

export const onlyRoPaASlice: ThematicSlice = {
    modelId: "gorc-im-base",
    version: "0.1.0",
    id: "gorc-im-ropaa-slice",
    label: "GORC Rules of Participation & Access Slice",
    nodes: baseModel.nodes.filter(
        node => getRoot(node, baseModel.nodes) === "rules-of-participation-and-access"
    ).map(n => ({ nodeId: n.id }))
}

export const models = {
    baseModel,
    ossModel,
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
