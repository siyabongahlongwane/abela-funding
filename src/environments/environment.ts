// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'abelatrust-funding',
    appId: '1:744740162231:web:633548324e7e14aa28db32',
    storageBucket: 'abelatrust-funding.appspot.com',
    apiKey: 'AIzaSyDfxYmiRU-e6s-3bINZ1Y8J9MTz5gdHp48',
    authDomain: 'abelatrust-funding.firebaseapp.com',
    messagingSenderId: '744740162231',
  },
  backendUrl: 'http://localhost:5000/api',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
