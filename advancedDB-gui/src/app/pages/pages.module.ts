import { NgModule } from "@angular/core";
import {
  NbMenuModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbFormFieldModule,
  NbButtonModule,
  NbSelectModule,
  NbTreeGridModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { FormsModule } from "@angular/forms";
import { PagesRoutingModule } from "./pages-routing.module";
import { SearchEngineComponent } from "./search-engine/search-engine.component";
import { DialogTextComponent } from "./search-engine/dialog-text.component";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    FormsModule,
    NbMenuModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    NbTreeGridModule,
    NbInputModule,
    NbFormFieldModule,
    NbCardModule,
  ],
  declarations: [PagesComponent, SearchEngineComponent, DialogTextComponent],
})
export class PagesModule { }
