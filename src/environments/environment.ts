// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyARJaQ6IU3ScMvwNA5PIo3gVJl_U45M7Vo",
    authDomain: "uwichem.firebaseapp.com",
    databaseURL: "https://uwichem.firebaseio.com",
    projectId: "uwichem",
    storageBucket: "uwichem.appspot.com",
    messagingSenderId: "297331885020"
  }
};
