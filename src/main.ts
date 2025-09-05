import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import 'preline/preline';

bootstrapApplication(AppComponent, appConfig).catch(console.error);
