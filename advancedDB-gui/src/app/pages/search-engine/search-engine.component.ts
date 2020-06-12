import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbDialogService,
} from "@nebular/theme";
import { HighlightService } from "./highlight.service";
import { DialogTextComponent } from "./dialog-text.component";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  title: string;
  distance: string;
  relevance: number;
  Url: string;
}

@Component({
  selector: "ngx-search-engine",
  templateUrl: "./search-engine.component.html",
  styleUrls: ["./search-engine.component.scss"],
})
export class SearchEngineComponent {
  distance: string = "cosine";
  knn: number = 5;
  query: string = "";

  defaultColumns = ["title", "distance", "relevance", "Url"];
  allColumns = [...this.defaultColumns];

  dataSource: NbTreeGridDataSource<any>;

  sortColumn: string = "";
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  results = [];

  constructor(
    private httpClient: HttpClient,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private dialogService: NbDialogService,
    private highlightService: HighlightService
  ) {
    //this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  open(row) {
    const text = this.results.filter((val) => {
      if (row.title === val.title) {
        return val.originalText;
      }
    })[0];
    this.highlightService.originalText = JSON.stringify(text["originalText"]);
    this.highlightService.keyword = this.query;
    this.dialogService.open(DialogTextComponent);
  }

  search() {
    this.httpClient
      .post("http://localhost:9000/search_document", {
        distance: this.distance,
        knn: this.knn,
        query: this.query,
      })
      .subscribe(
        (data) => {
          this.treeData = [];
          this.results = JSON.parse(data["data"]);
          for (let i = 0; i < this.results.length; i++) {
            this.treeData.push({
              data: {
                title: this.results[i]["title"],
                distance: this.results[i]["distance"],
                relevance: this.results[i]["relevance"],
                Url: this.results[i]["url"],
              },
            });
          }
          this.dataSource = this.dataSourceBuilder.create(this.treeData);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  changeSort(sortRequest: NbSortRequest): void {
    this.dataSource.sort(sortRequest);
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getDirection(column: string): NbSortDirection {
    if (column === this.sortColumn) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private treeData: TreeNode<FSEntry>[] = [];
}
