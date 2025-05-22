import {BaseModel, ModelProfile} from "../src/modules/LayeredModel";

export const baseModel: BaseModel = {
    version: "0.1.0",
    id: "gorc-im-base",
    label: "GORC Base Model",
    nodes: {
        /**
         * These are the essential elements of the base GORC model
         */
        "governance-and-leadership": {
            type: "essential-element",
            name: {
                longName: "Governance & Leadership",
                shortName: "G & L"
            },
            considerationLevel: "core",
            description: "Stakeholders that define the commons purpose and the development of the strategies, objectives, values, and policies that frame how that purpose will be pursued."
        },
        "rules-of-participation-and-access": {
            type: "essential-element",
            name: {
                longName: "Rules of Participation & Access",
                shortName: "RoP & A"
            },
            considerationLevel: "core",
            description: "A set of policies defining a minimal set of rights, obligations, and accountability governing the activities of those participating in the commons."
        },
        "sustainability": {
            type: "essential-element",
            name: {
                longName: "Sustainability",
                shortName: "S"
            },
            considerationLevel: "core",
            description: "Models and agreements made on how to fund or resource activities in a way that can be sustained over the long term."
        },

        /**
         * These are categories of Governance & Leadership
         */
        "commons-strategic-planning": {
            type: "category",
            parentId: "governance-and-leadership",
            name: {
                longName: "Commons Strategic Planning",
                shortName: "CSP"
            },
            considerationLevel: "core",
            description: "i.e. including governance structure, stakeholder strategy, sustainable operational strategy, and a strategy for the future"
        },
        "commons-intent-and-definition": {
            type: "category",
            parentId: "governance-and-leadership",
            name: {
                longName: "Commons intent and definition",
                shortName: "CID"
            },
            considerationLevel: "core",
            description: ""
        },
        "governance-of-quality-research": {
            type: "category",
            parentId: "governance-and-leadership",
            name: {
                longName: "Governance* rules, principles, and enforcement of quality for Research Object*s and Services* & Tools*",
                shortName: "Governance of quality Research"
            },
            considerationLevel: "core",
            description: "i.e. Research Object* ethics, including data ethics"
        },
        "internal-commons-policy": {
            type: "category",
            parentId: "governance-and-leadership",
            name: {
                longName: "Internal Commons* Policy Development, implementation, and review",
                shortName: "Internal Commons Policy"
            },
            considerationLevel: "core",
            description: "May be in the form of policies, guidelines, and/or standard operating procedures (SOP)"
        },
        "organizational-structure": {
            type: "category",
            parentId: "governance-and-leadership",
            name: {
                longName: "Organizational structures, designs, ways of working, and capability maturity level for the aims and context of the commons",
                shortName: "Organizational structure"
            },
            considerationLevel: "core",
            description: "Including a clear definition of working relationships between governance* and management"
        },

        /**
         * Commons Strategic Planning
         */

        "community-relations": {
            type: "attribute",
            parentId: "commons-strategic-planning",
            name: {
                longName: "Development and implementation of community* relations",
                shortName: ""
            },
            considerationLevel: "core",
            description: "i.e. Engagement* with stakeholders on matters that affect them and Shareholder relations (if applicable)"
        },
        "development-strategy": {
            type: "attribute",
            parentId: "commons-strategic-planning",
            name: {
                longName: "Development of strategy",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "risk-management": {
            type: "category",
            parentId: "commons-strategic-planning",
            name: {
                longName: "Risk Management Frameworks",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "policy-advocacy": {
            type: "category",
            parentId: "commons-strategic-planning",
            name: {
                longName: "Policy advocacy, and recommendations",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "funding-and-resourcing": {
            type: "category",
            parentId: "commons-strategic-planning",
            name: {
                longName: "Funding and Resourcing Frameworks",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "relevant-roadmaps": {
            type: "feature",
            parentId: "development-strategy",
            name: {
                longName: "Development of relevant roadmaps",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "strategic-review": {
            type: "feature",
            parentId: "development-strategy",
            name: {
                longName: "Regular strategic review and alignment exercises",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "strategic-planning": {
            type: "feature",
            parentId: "development-strategy",
            name: {
                longName: "Strategic planning influences and approaches",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "performance-metrics": {
            type: "feature",
            parentId: "development-strategy",
            name: {
                longName: "Development of organizational performance and capability metrics*",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "organizational-monitoring": {
            type: "feature",
            parentId: "development-strategy",
            name: {
                longName: "A monitoring organizational design or organizational performance system to gather qualitative and quantitative metrics*",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "develop-risk-management": {
            type: "attribute",
            parentId: "risk-management",
            name: {
                longName: "Development of risk management frameworks",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "implement-risk-management": {
            type: "attribute",
            parentId: "risk-management",
            name: {
                longName: "Implementation and operationalization of risk management frameworks",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "risk-identification": {
            type: "attribute",
            parentId: "risk-management",
            name: {
                longName: "Identification of risks and issues",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "financial-requirements": {
            type: "attribute",
            parentId: "funding-and-resourcing",
            name: {
                longName: "Identification of the financial and resource requirements for commons* activities",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "added-value": {
            type: "attribute",
            parentId: "funding-and-resourcing",
            name: {
                longName: "Demonstration of added value",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "business-continuity": {
            type: "feature",
            parentId: "develop-risk-management",
            name: {
                longName: "Business continuity planning",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "human-rights": {
            type: "feature",
            parentId: "develop-risk-management",
            name: {
                longName: "Human rights risk identification and management",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "technology-planning": {
            type: "feature",
            parentId: "develop-risk-management",
            name: {
                longName: "Technology and information governance* planning",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "health-planning": {
            type: "feature",
            parentId: "develop-risk-management",
            name: {
                longName: "Health and safety governance* planning",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "environmental-considerations": {
            type: "feature",
            parentId: "financial-requirements",
            name: {
                longName: "Environmental considerations",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "governance-considerations": {
            type: "feature",
            parentId: "financial-requirements",
            name: {
                longName: "Governance* considerations",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        "social-considerations": {
            type: "feature",
            parentId: "financial-requirements",
            name: {
                longName: "Social considerations",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        /*
        "": {
            type: "feature",
            parentId: "",
            name: {
                longName: "",
                shortName: ""
            },
            considerationLevel: "core",
            description: ""
        },
        */

        /**
         * These are categories of Rules of Participation and Access
         */
        "minimal-set-of-rights-and-obligations": {
            type: "category",
            parentId: "rules-of-participation-and-access",
            name: {
                longName: "A set of policies defining a minimal set of rights and obligations for the commons* community",
                shortName: "A minimal set of rights and obligations definition"
            },
            considerationLevel: "core",
            description: "May be a singular policy document with several sections addressing different aspects of rights and obligations, or several specific policies. May also be grouped with accountability in a larger rules of participation and access document for the commons."
        },
        "minimal-accountability": {
            type: "category",
            parentId: "rules-of-participation-and-access",
            name: {
                longName: "A set of policies defining minimal accountability for the commons* community",
                shortName: "Minimal accountability defintion"
            },
            considerationLevel: "core",
            description: "May be a singular policy document with several sections addressing different aspects of accountability, or several specific policies. May also be grouped with rights and obligations in a larger rules of participation and access document for the commons."
        },
    }
}

export const onlyGoLProfile: ModelProfile = {
    version: "0.1.0",
    id: "gorc-im-only-gol",
    label: "GORC Only Governance & Leadership",
    nodes: {
        /**
         * This is an example of removing nodes using a profile
         */
        "rules-of-participation-and-access": {type: "nothing"},
        "sustainability": {type: "nothing"},
        "minimal-set-of-rights-and-obligations": {type: "nothing"},
        "minimal-accountability": {type: "nothing"},
    }
}

export const models = {
    baseModel,
}

export const profiles = {
    onlyGoLProfile,
}
