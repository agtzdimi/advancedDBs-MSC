import { Component } from "@angular/core";

import { NbIconLibraries } from "@nebular/theme";
import { MENU_ITEMS } from "./pages-menu";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `
})
export class PagesComponent {
  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerSvgPack("open-adr", {
      ven:
        '<img src="assets/images/icon_vens.png" style="width: 2.5em; margin-left: -1.1rem">',
      vtn:
        '<img src="assets/images/icon_vtn.png" style="width: 2.5em; margin-left: -1.1rem">'
      // ...
    });
    this.iconLibraries.registerFontPack("font-awesome", {
      iconClassPrefix: "fa",
      packClass: "fa"
    });
  }

  menu = MENU_ITEMS;
}
