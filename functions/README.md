# Firebase functions development


## Setup

```bash
$ cd functions

# install current working directory dependencies
$ yarn
```

If you get an error like bellow, try with `--ignore-engines` option.

```bash
error @google-cloud/functions-emulator@1.0.0-beta.5: The engine "node" is incompatible with this module. Expected version "~6". Got "11.10.0"
error Found incompatible module
```

```bash
$ yarn --ignore-engines
```

## Local Test

### Run firebase functions:shell

```bash
$ yarn shell
yarn run v1.10.1
warning ../../package.json: No license field
$ firebase functions:shell
i  functions: Preparing to emulate functions.
Warning: You're using Node.js v11.10.0 but Google Cloud Functions only supports v6.11.5.
✔  functions: helloWorld
firebase > 
```

### Example for functions:shell 

```
# exec `helloWorld` function
firebase > helloWorld.get()
Sent request to function.
firebase > info: User function triggered, starting execution
info: Execution took 7 ms, user function completed successfully

RESPONSE RECEIVED FROM FUNCTION: 200, "Hello from Firebase!"
```
