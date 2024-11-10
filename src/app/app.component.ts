// parent-component.component.ts
import { Component, ChangeDetectorRef  } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [TabComponent, RouterOutlet],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedTabFile: string = 'https://www.alphatab.net/files/canon.gp';
  files: string[] = [
    'https://www.alphatab.net/files/canon.gp',
    'https://www.alphatab.net/files/features/Skillet.gp5',
  ];

  constructor(private cdr: ChangeDetectorRef) {}
  

  changeTabFile(): void {
    const index = Math.floor(Math.random() * this.files.length);
    this.selectedTabFile = this.files[index];
    console.log("Selected tab file:", this.selectedTabFile);

    this.cdr.detectChanges();
  }
}
