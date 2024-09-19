import { EncryptStorage } from 'encrypt-storage';

import { environment } from 'src/environments/environment';



export const encryptStorage = new EncryptStorage(environment.encryptAlgSecretKey, {

    storageType : 'sessionStorage',
    doNotEncryptValues: true

});



export const encryptLocalStorage = new EncryptStorage(environment.encryptAlgSecretKey, {

    storageType : 'localStorage',
    doNotEncryptValues: true

});