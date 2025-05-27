# Project Title

RDA GORC International Model(IM)

## Description

A visualisation application for the RDA GORC International Model.

## Getting Started

The project is meant to be run locally in a docker environment, visit the [Docker documentation](https://docs.docker.com/get-started/) to learn more.

### Dependencies

- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Executing program

After cloning the repository you can run the project with:

```
docker-compose up
```

Rebuild the container:

```
docker-compose build
```

Stopping the app:

```
docker-compose stop
```

### Unit testing

This project uses `vitest` for unit testing. Additional information on how to get started with `vitest` can be found [here](https://vitest.dev/guide/).

Run tests:

```sh
docker compose exec vite npm run test
```

### Adding dependencies

This project uses `npm` to handle dependencies. To add a dependency, first start the container with

```
docker compose up
```

Then add a dependency with:

```
docker compose exec vite npm install <your-new-dependency>
```

Now both your `package.json` and `package-lock.json` should be updated.

<!-- ## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.-->
