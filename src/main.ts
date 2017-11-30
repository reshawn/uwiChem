import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
<<<<<<< HEAD
   .then(() => {
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('/ngsw-worker.js');
       console.log("sw is registerd now");
     }
   })
=======
>>>>>>> parent of 52400ae... Merge branch 'master' of https://github.com/reshawn/uwiChem
  .catch(err => console.log(err));
