# Shuffle Lunch Matching App


## Build Setup

### First Init

```bash
# install dependencies
$ yarn
```

It is also necessary the `functions` dir's setup. (see `functions/README.md`)

### Build & Development

```bash
# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```


## Hosting with Your Firebase

### Requirements

* Create a new project on your Firebase console.
* Enable the following features.
  * Firebase Authentication
    * Need **Google** ID provider for login.
  * Cloud Firestore
  * Cloud Functions
  * Firebase Hosting
* `$ yarn firebase login`
  * login with your Google account.
* `$ yarn firebase use --add`
  * select the project ID to deploy.
* Set the following environment variables. (used in Nuxt build configuration)

```bash
export PROJECTID=
export APIKEY=
export AUTHDOMAIN=
```

recommendation: [direnv/direnv](https://github.com/direnv/direnv)

### Deploy to Firebase

```bash
$ yarn deploy
```
