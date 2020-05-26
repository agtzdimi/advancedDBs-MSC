import { Component, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { HighlightService } from "./highlight.service";

@Component({
  template: `
    <nb-card size="large">
      <nb-card-header>Full Text</nb-card-header>
      <nb-card-body>
        <label [innerHtml]="title"></label>
      </nb-card-body>
      <nb-card-footer style="display: flex;justify-content: center;">
        <button nbButton status="primary" (click)="dismiss()">
          Close Window
        </button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class DialogTextComponent {
  @Input() title: string;
  keyword;

  constructor(
    protected ref: NbDialogRef<DialogTextComponent>,
    private highlightService: HighlightService
  ) {
    this.title = this.highlightService.originalText;
    this.keyword = this.highlightService.keyword;
    const re = new RegExp(this.keyword, "ig");
    const replaceString =
      '<span class="bg-success">' + this.keyword + "</span>";
    this.title = this.title.replace(re, replaceString);
    console.log(this.title);
  }

  dismiss() {
    this.ref.close();
  }
}
