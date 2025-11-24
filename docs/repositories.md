# Repositories instruction guide

This guide aims to give more detailed instructions on how to add your own GORC IM to the application. The read me file
contains information on how to link the application with the created repository.

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

## Structure of baseModels, profiles and slices

### Base model
A base model describes the full conceptual model — nodes, relationships, and supporting metadata.
Create and place the file in your repository, for example:

`models/my-base-model.json`

The model in the json file should contain information about the model and the nodes it contains:
```json
{
  "version": "0.1.0",
  "id": "my-model",
  "label": "My Model name",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": [
    {
      "id": "my-id-1",
      "type": "type",
      "icon": "https://example.org/path/to/icons/icon.png",
      "shortName": "Short name",
      "name": "Name",
      "description": "Some description",
      "considerationLevel": "level"
    },
    {
      "id": "my-id-2",
      "parentId": "some-parent-id",
      "type": "type",
      "shortName": "Short name",
      "name": "Name",
      "description": "Some description",
      "considerationLevel": "level"
    }
  ]
}
```  

Connect the base model json file to the root.json file by adding it to the baseModels array.
The baseModels array in the root.json contains references to the models:

```json
   {
  "baseModels": [
    { "ref": "models/my-base-model.json" }
  ]
}
```

Multiple base models are allowed:

```json
{
  "baseModels": [
    { "ref": "models/model-a.json" },
    { "ref": "models/model-b.json" }
  ]
}
```

### Profiles

A profile provides a filtered or adjusted view of a specific base model.

Create the profile JSON file and add it to your repository, for example:

`profiles/my-profile.json`

A profile could be formatted like this, connected to one of the models by an id and containing the nodes:

```json
{
  "id": "my-profile",
  "label": "My profile",
  "version": "0.1.0",
  "modelId": "my-model",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": [
    {
      "id": "my-id-1",
      "type": "type",
      "icon": "https://example.org/path/to/icons/icon.png",
      "shortName": "Short name",
      "name": "Name",
      "description": "Some description",
      "considerationLevel": "level"
    },
    {
      "id": "my-id-2",
      "type": "nothing"
    }
  ]
}
```

Add it under `profiles` in `root.json`:

```json
{
  "profiles": [
    {
      "ref": "profiles/my-profile.json",
      "modelId": "my-base-model"
    }
  ]
}
```
Multiple profiles can be added after each other, comma separated.

### Adding a thematic slice

A slice groups a set of nodes around a shared theme or concept.

Create the slice JSON and place it in the repository for example:

`slices/my-slice.json`

A slice contains a reference to a model:


```json
{
  "modelId": "my-base-model",
  "version": "0.1.0",
  "id": "my-thematic-slice",
  "label": "Thematic Slice A",
  "updatedAt": "2025-10-09T14:16:27.732Z",
  "nodes": [
    { "nodeId": "some-node-id" },
    { "nodeId": "some-other-node-id" }
  ]
}
```

Register the slice in the root.json file by adding it to `thematicSlices`:

```json
{
  "thematicSlices": [
    {
      "ref": "slices/my-slice.json",
      "modelId": "my-base-model"
    }
  ]
}
```
Multiple slices can be added after each other. 

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
      "ref": "profiles/my-profile.json",
      "modelId": "my-base-model"
    },
    {
      "ref": "profiles/my-other-profile.json",
      "modelId": "my-base-model"
    }
  ],
  "thematicSlices": [
    {
      "ref": "slices/my-slice.json",
      "modelId": "my-base-model"
    },
    {
      "ref": "slices/my-other-slice.json",
      "modelId": "my-base-model"
    }
  ]
}
```
Now add the url for this file with its id and name to the config file in the project described in the [read me](../README.md) file.

---

## Checklist

Before using your repository in the application, verify:

- A single file with all the references such as `root.json` exists at the top level.
- All fields and array sections (`baseModels`, `profiles`, `thematicSlices`) are present.
- All referenced files exist and contain valid JSON.
- All `modelId` values in profiles and slices match the IDs of defined base models.
- All `ref` paths are correct and reachable (relative or absolute).

