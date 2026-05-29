# Repositories instruction guide

This guide aims to give more detailed instructions on how to add your own GORC IM to the application. The read me file
contains information on how to link the application with the created repository.

Currently there is one existing example of generating repositories using code:

- [External full example](https://github.com/NBISweden/gorc-im-example-repo): Builds an example repository using static data and an exported `xlsx` GORC IM model description (This can be used as a template for setting up github actions to host custom repositories)

## How to create a json repository

Each repository should expose a single file at its top level. Create a file in the root of the repository, for example:
`root.json`

### The root file structure

The basic structure looks like this:

```json
{
  "id": "my-repository-id",
  "name": "My Repository Name",
  "description": "Short summary of what this repository contains.",
  "url": "https://example.org/path/to/root.json",
  "baseModels": [],
  "profiles": [],
  "thematicSlices": []
}
```

The id and name of the root.json file are used when linking the repository to the application, see
the [read me](../README.md) file.

## Using base models, profiles and thematic slices
The data for base models, profiles and thematic slices are all contained within separate json files. These files are references by the root json file.

A base model json file can be included by adding it to the `baseModels` list as follows:
```json
{
  "baseModels": [
    { "ref": "models/my-base-model.json" }
  ]
}
```

A profile json file can be included by adding it to the `profiles` list as follows:
```json
{
  "profiles": [
    { "ref": "models/my-base-model-profile.json", "modelId": "my-base-model" }
  ]
}
```

A thematic slice can be included by adding it to the `thematicSlices` list as follows:
```json
{
  "thematicSlices": [
    { "ref": "models/my-base-model-slice.json", "modelId": "my-base-model" }
  ]
}
```

### Strucutre of the base model
A base model describes the full conceptual model — nodes, relationships, and supporting metadata.
Create and place the file in your repository, for example: `models/my-base-model.json`

The fields of a model json file can be described as follows:

- `version`: A semantic version number
- `id`: A repository level unique id for the model
- `label`: The label of the model shown in the UI
- `updatedAt`: The date at which the model was updated
- `nodes`: A list of model nodes. Either a Hierarchical node (EssentialElement, Category, Subcategory, Attribute or Feature) or a KPI/Metric node

An example of an empty model can look as follows:

```json
{
  "version": "0.1.0",
  "id": "my-model",
  "label": "My Model name",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": []
}
```

#### Shared node properties
The nodes of a model have a number of shared properties which can be described as follows:

- `id`: A model level unique id for the node
- `shortName`: A short name describing the node to situations where space is limited in the UI
- `name`: A longer name for situations with enough space in the UI
- `description`: A description of the node
- `considerationLevel`: Can be "core", "desirable" or "optional"


#### Hierarchical nodes
Hierarchical nodes are either EssentialElement, Category, Subcategory, Attribute or Feature nodes. The unique properties for hierarchical nodes can be described as follows:

- `childOf`: A reference to anther node `id` in the same model (Note that EssentialElement does not have this property)
- `type`: Can be "essential-element", "category", "subcategory", "attribute" or "feature" depending on which node is being represented

An example of a hierarchical node can look as follows:

```json
{
  "id": "example-category",
  "childOf": "example-ee",
  "type": "category",
  "shortName": "An example category",
  "name": "An example category demonstrating nodes",
  "description": "This example category demonstrates the use of a category node",
  "considerationLevel": "desirable"
}
```

#### KPI/Metric nodes
KPI/Metric nodes are of the type KPI. The unique properties of these nodes can be described as follows:

- `measurementOf`: A reference to anther node `id` in the same model
- `indicatorOf`: A reference to anther node `id` in the same model
- `type`: Can be "metric", "kpi" depending on which node is being represented

An example of a KPI/Metric node looks as follows:

```json
{
  "id": "example-metric",
  "measurementOf": "example-ee1",
  "indicatorOf": "example-ee2",
  "type": "metric",
  "shortName": "An example metric",
  "name": "An example metric demonstrating nodes",
  "description": "This example metric demonstrates the use of a metric node",
  "considerationLevel": "core"
}
```

### Structure of profiles

A profile provides a filtered or adjusted view of a specific base model.

Create the profile JSON file and add it to your repository, for example: `profiles/my-base-model-profile.json`

A profile has a similar structure as a base model but with the addition of a `modelId` and an expectation of the nodes
to be applied as changes to exisiting nodes. The rules applies for `nodes` in a profile as what would apply for `nodes` in a base model.
The main difference is that a profile allows for one additional node type which is the `Nothing` node.

A profile could be formatted like this, connected to one of the models by an id and containing the node changes:

```json
{
  "id": "my-base-model-profile",
  "label": "My profile",
  "version": "0.1.0",
  "modelId": "my-model",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": [
    {
      "id": "example-category",
      "childOf": "example-ee",
      "type": "category",
      "shortName": "An example category",
      "name": "An example category demonstrating nodes",
      "description": "This example category demonstrates the use of a category node",
      "considerationLevel": "desirable"
    },
    {"type": "nothing", "nodeId": "example-metric"}
  ]
}
```

#### Nothing node
The nothing node has the following properties:

- `type`: Can only be "nothing"
- `nodeId`: A reference to a node id, in the base model, which should be removed when the profile is applied


### Structure of thematic slices

A slice groups a set of nodes around a shared theme or concept.

Create the slice JSON and place it in the repository for example: `slices/my-base-model-slice.json`

The properties of the `nodes` of a thematic slice can be described as follows:

- `nodeId`: A reference to a node `id`, in the base model, which should be included when the slice is applied.

A slice contains a reference to a model:

```json
{
  "modelId": "my-base-model",
  "version": "0.1.0",
  "id": "my-base-model-slice",
  "label": "Thematic Slice A",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": [
    { "nodeId": "example-ee" },
    { "nodeId": "example-category" }
  ]
}
```

### Results

After creating and adding the references to the `root.json` the file could look like this:

```json
{
  "id": "my-repository-id",
  "name": "My Repository Name",
  "description": "Short summary of what this repository contains.",
  "url": "https://example.org/path/to/root.json",
  "baseModels": [
    { "ref": "models/model-a.json" },
    { "ref": "models/model-b.json" }
  ],
  "profiles": [
    {
      "ref": "profiles/my-base-model-profile.json",
      "modelId": "my-base-model"
    },
    {
      "ref": "profiles/my-other-profile.json",
      "modelId": "my-base-model"
    }
  ],
  "thematicSlices": [
    {
      "ref": "slices/my-base-model-slice.json",
      "modelId": "my-base-model"
    },
    {
      "ref": "slices/my-other-slice.json",
      "modelId": "my-base-model"
    }
  ]
}
```
Now add the url for this file with its id and name to the config file in the project described 
in the [read me](../README.md) file.

---

## Checklist

Before using your repository in the application, verify:

- A single file with all the references such as `root.json` exists at the top level.
- All fields and array sections (`baseModels`, `profiles`, `thematicSlices`) are present.
- All referenced files exist and contain valid JSON.
- All `modelId` values in profiles and slices match the IDs of defined base models.
- All `ref` paths are correct and reachable (relative or absolute).

