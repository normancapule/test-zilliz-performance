# test-zilliz-performance

## Getting Started

### Installation

0. Install node:lts in your local. I suggest using [fnm](https://github.com/Schniz/fnm)
1. Run `npm install` to install dependencies.
2. Run `cp .env.sample .env` to create a local environment file.
3. Get the correct values for `.env` from the maintainers.
4. Run `npm install -g ts-node`

### Run the test

0. Run `ts-node index.ts`
1. The result should be an array of numbers to represent duration. Each number is in ms.
