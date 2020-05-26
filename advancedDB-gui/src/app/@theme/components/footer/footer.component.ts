import { Component } from "@angular/core";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <span class="created-by">
      Created with ♥ by <b>Dimitrios Agtzidis</b>. Special thanks to Akveo team
      for the Open Source Application:
      <a href="https://akveo.page.link/8V2f" target="_blank">Akveo</a>
    </span>
    <div class="socials">
      <a
        href="https://github.com/agtzdimi/Web_Mining"
        target="_blank"
        class="ion ion-social-github"
      ></a>
    </div>
  `,
})
export class FooterComponent {}
