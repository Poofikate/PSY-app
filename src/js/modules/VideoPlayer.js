import Plyr from 'plyr';

const media = window.matchMedia('(max-width: 900px)').matches;

class VideoPlayer {
  constructor($player) {
    this.$player = $player;
    this.$links = document.querySelectorAll('.j_video-link') || null;
    this.$play = document.querySelector('.j_video-play') || null;
    this.$time = document.querySelector('.j_video-time') || null;
    this.$title = document.querySelector('.j_video-title') || null;

    this.desktopControls = [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'pip',
      'airplay',
      'fullscreen',
    ];

    this.mobileControls = [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'fullscreen',
    ];

    // callbacks
    this.onPausedCallback = function() {};

    this.init();
  }

  init() {
    this.player = new Plyr(this.$player, {
      controls: media ? this.mobileControls : this.desktopControls,
    });

    this.player.on('pause', () => this.onPausedCallback.apply());

    if (this.$links && this.$links.length) {
      this.$links.forEach(($link) =>
        $link.addEventListener('click', () => {
          this.loadVideo($link);

          if (media) this.scrollToVideo();
        })
      );
    }

    if (this.$play)
      this.$play.addEventListener('click', () => this.player.togglePlay());
  }

  loadVideo($link) {
    const video = $link.getAttribute('data-video');
    const poster = $link.getAttribute('data-poster');
    const provider = $link.getAttribute('data-provider');

    if (video) {
      this.player.source = {
        type: 'video',
        class: 'j_video-player',
        sources: [
          {
            src: video,
            provider: provider,
          },
        ],
      };

      if (poster) {
        this.player.poster = poster;
      } else {
        console.error(`Failed Loading Poster! Invalid URL (${poster});`);
      }

      this.changeText($link);
    } else {
      console.error(`Failed Loading Video! Invalid URL (${video});`);
    }
  }

  changeText($link) {
    const $time = $link.querySelector('.exercises-video__time');
    const $title = $link.querySelector('.exercises-video__title');

    if ($time) this.$time.textContent = $time.textContent;
    if ($title) this.$title.textContent = $title.textContent;
  }

  scrollToVideo() {
    const $parent = this.$play.parentNode;

    const offset = 80;
    const rect = $parent.getBoundingClientRect();
    const top = window.pageYOffset + rect.top - offset;

    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  setPausedCallback(callback) {
    this.onPausedCallback = callback;
  }
}

const $player = document.querySelector('.j_video-player');
if ($player) {
  const player = new VideoPlayer($player);
  window.player = player;
}
