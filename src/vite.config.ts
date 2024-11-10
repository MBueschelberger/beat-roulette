import { defineConfig } from "vite";
import { alphaTab } from "@coderline/alphatab/vite";
import * as path from 'path';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


export default defineConfig({
  plugins: [
    alphaTab(
    {
        alphaTabSourceDir: path.resolve('/app/node_modules/@coderline/alphatab/dist')
    }    
  )],
  server: {
    port: 4200,
    host: '0.0.0.0'
  }  
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
