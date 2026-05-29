# RDA GORC International Model(IM) Viewer

The main purpose of this application is to provide a way to explore the GORC International Model. It is a fork and continuation of what was started in [GORC IM Viwer](https://github.com/NBISweden/rda-gorc-im). The main goal of this project is to build upon and improve the previous project without necessarily being restricted to maintaining compatibility.

The goals can be stated as follows:
- Provide a great UI to explore the node space of, amoung other models, the GORC IM
- Provide a maintainable code base by using NextJS and Bootstrap as core technologies
- Provide a generalized framework for presenting models similar to GORC IM
- Provide a great UI to explore the content of a model repository
- Allow a high level of customisability in the repository data

Try the current version using the [demo deployment](https://pdmnyberg.github.io/rda-gorc-im-experimental/).

## Getting Started

Make sure to check out the [demo deployment](https://pdmnyberg.github.io/rda-gorc-im-experimental/) in order to get a grasp of what the project does. Development is primarily done using docker but the app is intended to be deployed as a set of static files and should be fit to deploy using any static file server. This section will focus on how to get started with development.

In order to get started you will need to:
- [Install dependencies](#dependencies)
- [Configure the app](#configure-the-app)
- [Start the app](#start-the-app)

### Dependencies
- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed


### Configure the app
In order for the app to work you need to configure it. A basic configuration can look as follows:

```json
{
  "title": "GORC IM Viewer",
  "subTitle": "Private edition",
  "repositories": [
    {
      "url": "https://nbisweden.github.io/gorc-im-example-repo/root.json",
      "id": "gorc-and-oss",
      "name": "GORC and OSS"
    }
  ]
}
```
In the example configuration the content can be requires at least one repository in order for the application to provide any value for an end user. The configuration file structure can be described as follows:

- `title`: The title shown in the main menu
- `subTitle`: An optional sub title shown in the main menu
- `repositories`: A list of repositories for the user to explore. Atleast one repository is require to provide value for the end user.
- `repositories[].url`: The url of a repository
- `repositories[].id`: The id of a repository
- `repositories[].name`: The name of a repository, used as a label when listing the repository

If you want to know how to create your own model repository, please have a look at the [repository documentation](./docs/repositories.md).

### Start the app
There is a utility script which wrapped docker compose mostly for convenience. This script can be used to start the container as follows:

```
./compose-dev.sh up
```

## Acknowledgments
This [original project](https://github.com/NBISweden/rda-gorc-im), from which this was spawned, has received funding from the European Union’s Horizon Europe research and innovation programme under grant agreement No. 101094406