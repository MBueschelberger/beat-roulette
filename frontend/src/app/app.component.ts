// parent-component.component.ts
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { RouterOutlet } from '@angular/router';
import { DataService } from './api/data-api.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [TabComponent, RouterOutlet, FormsModule, CommonModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  selectedTabFile: string = "";
  files: string[] = [];
  protocol: string = "";
  hostname: string = "";
  port: string = "";
  baseUrl: string = "";


  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef) {
    dataService = dataService;
    cdr = cdr;
  }

  ngOnInit(): void {
    console.log("Initializing app component");
    this.protocol = window.location.protocol;
    this.hostname = window.location.hostname;
    this.port = window.location.port;    
    this.baseUrl = `${this.protocol}//${this.hostname}`;
    if (this.protocol !== 'https:' && this.port) {
      this.baseUrl += `:${this.port}`;
    }
    this.dataService.getTabs().subscribe((tabs) => {
      this.files = tabs;
      console.log("Received tabs:", this.files);
      this.changeTabFile();
    });
    console.log("Initialized app component");
  }
  

  changeTabFile(): void {
    const index = Math.floor(Math.random() * this.files.length);
    this.selectedTabFile = `${this.baseUrl}/api/tabs/${this.files[index]}`;
    console.log("Selected tab file:", this.selectedTabFile);
    this.cdr.detectChanges();
  }


  onSelectionChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedTabFile = `${this.baseUrl}/api/tabs/${selectedValue}`;
    console.log('Selected value:', selectedValue);
  }
}
