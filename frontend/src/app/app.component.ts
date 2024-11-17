// parent-component.component.ts
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { RouterOutlet } from '@angular/router';
import { DataService } from './api/data-api.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [TabComponent, RouterOutlet],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  selectedTabFile: string = "";
  files: string[] = [];
  protocol: string = "";
  hostname: string = "";
  port: string = "";


  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef) {
    dataService = dataService;
    cdr = cdr;
  }

  ngOnInit(): void {
    this.protocol = window.location.protocol;
    this.hostname = window.location.hostname;
    this.port = window.location.port;    
    this.dataService.getTabs().subscribe((tabs) => {
      this.files = tabs;
      this.changeTabFile();
    });
  }
  

  changeTabFile(): void {
    let baseUrl = `${this.protocol}//${this.hostname}`;
    if (this.protocol !== 'https:' && this.port) {
      baseUrl += `:${this.port}`;
    }
    const index = Math.floor(Math.random() * this.files.length);
    this.selectedTabFile = this.selectedTabFile = `${baseUrl}/api/tabs/${this.files[index]}`;
    console.log("Selected tab file:", this.selectedTabFile);
    this.cdr.detectChanges();
  }
}
