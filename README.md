# Serverless Hexagonal workshop

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Run tests

#### Start the docker compose.

```bash
npm run docker:up
```

#### Init resources needed to run tests.

```bash
npm run test:init
```

This generates a .env.test file with the environment variables needed ot run tes tests.
You can feed that to your configuration in Intellij.

#### Run tests

```bash
npm run test
```

#### Clear environment

```bash
npm run docker:down
```



## Deploy

To deploy we use serverless framework.

### Get API Key for CoinLayer API

You need to register in this [website](https://coinlayer.com/).

### Environment file
Your application needs to have access to this key.
Generate a `.env` file and write the following:

```dotenv
COIN_LAYER_ACCESS_KEY=KEY_FROM_API
```

### Deploy the serverless stack

```bash
npx env-cmd -f .env npx serverless deploy --stage dev
```
