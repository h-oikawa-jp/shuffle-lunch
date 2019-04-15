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

Run firebase functions server on localhost.

```bash
$ yarn serve

...

=== Serving from '**/shuffle-lunch'...

i  functions: Preparing to emulate functions.
✔  functions: helloWorld: http://localhost:5000/{project-id}/{region}/helloWorld
```

```bash
$ curl http://localhost:5000/{project-id}/{region}/helloWorld
Hello from Firebase!
```
