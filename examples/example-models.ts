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
