import { Component, AfterViewInit, ViewEncapsulation, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as alphaTab from '@coderline/alphatab';


@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  standalone: true,
  styleUrls: ['./tab.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent implements AfterViewInit, OnChanges  {
  @ViewChild('alphaTabContainer', { static: false }) alphaTabContainer!: ElementRef;  // Reference to the container
  @Input() tabInput: string = 'https://www.alphatab.net/files/canon.gp'; // Input property to receive data
  @Input() soundFontInput: string = "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2";


  formatDuration(milliseconds: number) {
    let seconds = milliseconds / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  ngAfterViewInit(): void {
    this.initializeAlphaTab();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabInput'] && !changes['tabInput'].firstChange) {
      // Re-initialize alphaTab whenever tabInput changes
      this.initializeAlphaTab();
    }
  }

  initializeAlphaTab() {
    // Wait for the view to be initialized before interacting with DOM elements

    const wrapper = this.alphaTabContainer.nativeElement;  // Access the native DOM element
    const main = wrapper.querySelector('.at-main');

    if (main) {
      const settings = {
        file: this.tabInput,
        player: {
          enablePlayer: true,
          soundFont: this.soundFontInput,
          scrollElement: wrapper?.querySelector('.at-viewport')
        },
      };

      const api = new alphaTab.AlphaTabApi(main, settings);

      // Overlay logic
      const overlay: any = wrapper?.querySelector(".at-overlay");
      api.renderStarted.on(() => {
        if (overlay) overlay.style.display = "flex";
      });
      api.renderFinished.on(() => {
        if (overlay) overlay.style.display = "none";
      });

      // Track selector
      const trackList = wrapper?.querySelector(".at-track-list");
      if (trackList) {
        api.scoreLoaded.on((score: any) => {
          trackList.innerHTML = "";
          score.tracks.forEach((track: any) => {
            const trackItem = this.createTrackItem(track, api);
            trackList.appendChild(trackItem);
          });
        });
      }

      api.renderStarted.on(() => {
        this.updateTrackList(api, trackList);
      });

      /** Controls **/
      this.setupControls(wrapper, api);

      // Player loading indicator
      const playerIndicator: any = wrapper?.querySelector(".at-controls .at-player-progress");
      if (playerIndicator) {
        api.soundFontLoad.on((e: any) => {
          const percentage = Math.floor((e.loaded / e.total) * 100);
          playerIndicator.innerText = `${percentage}%`;
        });
        api.playerReady.on(() => {
          playerIndicator.style.display = "none";
        });
      }

      this.setupPlayPauseControls(wrapper, api);
      this.setupSongPosition(wrapper, api);
    }
  }

  private createTrackItem(track: any, api: any) {
    const template: any = document.querySelector("#at-track-template");
    if (!template) {
      throw new Error("No track template found");
    }

    const trackItem = template.content.cloneNode(true).firstElementChild;
    if (!trackItem) {
      throw new Error("No track item found in template");
    }

    const trackNameElement = trackItem.querySelector(".at-track-name");
    if (!trackNameElement) {
      throw new Error("No track name element found in template");
    }

    trackNameElement.innerText = track.name;
    trackItem.track = track;
    trackItem.onclick = (e: any) => {
      e.stopPropagation();
      api.renderTracks([track]);
    };
    return trackItem;
  }

  private updateTrackList(api: any, trackList: any) {
    const tracks = new Map();
    api.tracks.forEach((t: any) => {
      tracks.set(t.index, t);
    });

    const trackItems = trackList.querySelectorAll(".at-track");
    trackItems.forEach((trackItem: any) => {
      if (tracks.has(trackItem.track.index)) {
        trackItem.classList.add("active");
      } else {
        trackItem.classList.remove("active");
      }
    });
  }

  private setupControls(wrapper: any, api: any) {
    const countIn = wrapper?.querySelector('.at-controls .at-count-in');
    if (countIn) {
      countIn.onclick = () => {
        countIn.classList.toggle('active');
        api.countInVolume = countIn.classList.contains('active') ? 1 : 0;
      };
    }

    const metronome = wrapper?.querySelector(".at-controls .at-metronome");
    if (metronome) {
      metronome.onclick = () => {
        metronome.classList.toggle("active");
        api.metronomeVolume = metronome.classList.contains("active") ? 1 : 0;
      };
    }

    const loop = wrapper?.querySelector(".at-controls .at-loop");
    if (loop) {
      loop.onclick = () => {
        loop.classList.toggle("active");
        api.isLooping = loop.classList.contains("active");
      };
    }

    const zoom = wrapper?.querySelector(".at-controls .at-zoom select");
    if (zoom) {
      zoom.onchange = () => {
        const zoomLevel = parseInt(zoom.value) / 100;
        api.settings.display.scale = zoomLevel;
        api.updateSettings();
        api.render();
      };
    }

    const layout = wrapper?.querySelector(".at-controls .at-layout select");
    if (layout) {
      layout.onchange = () => {
        switch (layout.value) {
          case "horizontal":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
            break;
          case "page":
            api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
            break;
        }
        api.updateSettings();
        api.render();
      };
    }
  }

  private setupPlayPauseControls(wrapper: any, api: any) {
    const playPause = wrapper?.querySelector(".at-controls .at-player-play-pause");
    const stop = wrapper?.querySelector(".at-controls .at-player-stop");

    if (playPause && stop) {
      playPause.onclick = (e: any) => {
        if (e.target.classList.contains("disabled")) return;
        api.playPause();
      };

      stop.onclick = (e: any) => {
        if (e.target.classList.contains("disabled")) return;
        api.stop();
      };

      api.playerReady.on(() => {
        playPause.classList.remove("disabled");
        stop.classList.remove("disabled");
      });

      api.playerStateChanged.on((e: any) => {
        const icon = playPause.querySelector("i.fas");
        if (e.state === alphaTab.synth.PlayerState.Playing) {
          icon.classList.remove("fa-play");
          icon.classList.add("fa-pause");
        } else {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }
      });
    }
  }

  private setupSongPosition(wrapper: any, api: any) {
    const songPosition = wrapper?.querySelector(".at-song-position");
    let previousTime = -1;

    if (songPosition) {
      api.playerPositionChanged.on((e: any) => {
        const currentSeconds = (e.currentTime / 1000) | 0;
        if (currentSeconds === previousTime) return;
        songPosition.innerText =
          this.formatDuration(e.currentTime) + " / " + this.formatDuration(e.endTime);
      });
    }
  }
}
