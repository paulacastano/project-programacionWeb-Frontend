// Servicio que gestiona la configuración global de la aplicación.
// Guarda y carga la configuración del layout (tema, colores, barra lateral, etc.)
// en el localStorage para persistir entre recargas de la página.

import { Injectable } from '@angular/core';
import { InConfiguration } from '../core/models/config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public configData!: InConfiguration;

  constructor() {
    this.setConfigData();
  }

  ngOnInit() {
    this.loadConfigData();
  }

  setConfigData() {
    this.configData = {
      layout: {
        rtl: false, // options:  true & false
        variant: 'light', // options:  light & dark
        theme_color: 'cyan', // options:  white, black, purple, blue, cyan, green, orange
        logo_bg_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: 'light', // options:  light & dark
        },
      },
    };
    localStorage.setItem('configData', JSON.stringify(this.configData));
  }

  // Función que carga la configuración desde localStorage
  loadConfigData() {
    const configData = localStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
    } else {
      this.setConfigData();
    }
  }
}
