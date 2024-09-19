// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
 //baseurl : 'http://localhost:45566/api',
//  production: true,
//  baseurl : 'https://10.162.80.41/BIS_API_DEV/api',
//  baseurl : 'https://bis.lenovo.com/BISAPI/api',
  // baseurl : 'http://bis.lenovo.com/BISAPI/api',
baseurl : 'https://indiamfg.engg.lenovo.com/CCL/CCL_API/api',
encryptAlgSecretKey: 'BIS-Secret-Key'

};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
