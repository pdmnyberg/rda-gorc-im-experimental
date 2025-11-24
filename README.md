# Project Title

RDA GORC International Model(IM)

## Description

A visualisation application for the RDA GORC International Model.

## Getting Started

The project is meant to be run locally in a docker environment, visit the [Docker documentation](https://docs.docker.com/get-started/) to learn more.

### Dependencies

- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Initial setup

In order for the system to work you need to make sure that you have a repository available. Repositories can be:

- generated locally (the built-in example repository), or
- hosted anywhere that is reachable over HTTP(S), e.g. on GitHub using
  *raw* URLs.

#### Step 1: Generate the local example files
Start by running:

```
docker compose run vite npm run build-examples
```

Then you should add the file `public/config.json` which should contain the following:

```json
{
  "title": "This is my GORC IM",
  "repositories": [
    {
      "url": "example-repo/root.json",
      "id": "example-repo",
      "name": "Example Repo"
    }
  ]
}
```

#### Step 2: Add your repository to the application
The application only needs the URL to a single file with
[json formatting](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON), 
for example `root.json`; from there it follows the references to load the models,
profiles and slices. When you have the correct format in the repository, you should add it to the file `public/config.json` 
which should contain the following:
```json
{
"url": "https://raw.githubusercontent.com/<github-user-or-org>/<repository>/refs/heads/<branch>/<repository-folder>/root.json",
"id": "id-of-the-root-json-file",
"name": "name-of-the-root-json-file"
}
```
Make sure to replace the url, name and id with the ones according to your repository.
Learn more about how to set up a repository with the GORC IM, [documentation about repositories](docs/repositories.md).

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

### Formatting the code

This project includes "Prettier" as a code formatter. Formatting rules are specified in the `.prettierrc` file. Files that are ignored from formatting are specified in the `.prettierignore` file.

Run the formatter on your code:

```
npm run prettify
```

**Be aware:** This will overwrite all the files in the project that are not specified in the `.prettierignore` file.

To read more about how to use Prettier, check their [documentation](https://prettier.io/docs/).

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
