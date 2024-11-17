import { Component, AfterViewInit, ViewEncapsulation, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as alphaTab from '@coderline/alphatab';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  standalone: true,
  styleUrls: ['./tab.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent implements AfterViewInit, OnChanges, OnDestroy  {

  @Input() tabInput: string = 'https://www.alphatab.net/files/canon.gp'; // Input property to receive data
  @Input() soundFontInput: string = "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2";

  #alphaTab!: alphaTab.AlphaTabApi;
  @ViewChild('alphaTab') alphaTabElement!: ElementRef<HTMLDivElement>

  metronomeEnabled: boolean = false;
  loopEnabled: boolean = false;
  speedSliderValue: number | null = null;
  orgSpeed: number | null = null;
  title = 'alphatab-app';

  ngAfterViewInit(): void {
    this.initializeAlphaTab();
  }

  playPause() {
    this.#alphaTab.playPause();
  }

  ngOnDestroy(): void {
    this.#alphaTab.destroy();
  }


  useMetronome() {
    this.metronomeEnabled = !this.metronomeEnabled;
    this.#alphaTab.metronomeVolume = this.metronomeEnabled ? 1 : 0;
  }


  setSpeed(event: Event): void {
    const target = event.target as HTMLInputElement;
    const speed = target.value;
    if (speed !== null) {
      const value = parseInt(speed);
      this.speedSliderValue = value;
      this.#alphaTab.playbackSpeed = value / this.orgSpeed!;
    }

  }

  useLoop() {
    this.loopEnabled = !this.loopEnabled;
    this.#alphaTab.isLooping = this.loopEnabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabInput'] && !changes['tabInput'].firstChange) {
      // Re-initialize alphaTab whenever tabInput changes
      this.#alphaTab.destroy();
      this.initializeAlphaTab();
    }
  }

  /**
   * Initialize the alphaTab player.
   *
   * This function is called whenever the component is initialized, and when the tabInput property changes.
   * It creates a new instance of the alphaTab player and configures it with the tabInput and soundFontInput properties.
   *
   * @private
   */
  initializeAlphaTab() {
    this.#alphaTab = new alphaTab.AlphaTabApi(this.alphaTabElement.nativeElement, {
      core: {
        file: this.tabInput,
        fontDirectory: '/font/'
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        soundFont: this.soundFontInput
      }
    } as alphaTab.Settings);
    this.#alphaTab.metronomeVolume = this.metronomeEnabled ? 1 : 0;
    this.#alphaTab.isLooping = this.loopEnabled;
    this.#alphaTab.scoreLoaded.on((score: any) => {
      this.speedSliderValue = score.tempo;
      this.orgSpeed = score.tempo;
    });
  }
}
