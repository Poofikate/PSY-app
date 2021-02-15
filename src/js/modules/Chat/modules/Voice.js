import annyang from 'annyang/dist/annyang';

export default class Voice {
  constructor(keywords) {
    // this.keywords = (keywords && keywords.replaceAll(',', '|')) || '';
    // this.keywords = keywords.join('|');
    this.speech = '';
    this.oldSpeech = '';
    this.continueSpeech = '';
    this.keywords = keywords;
    this.annyang = annyang;

    this.isNewVoice = true;

    // callbacks
    this.onResultCallback = () => {};
    this.onResultMatchCallback = () => {};
    this.onContinueVoiceCallback = () => {};

    this.init();
  }

  init() {
    this.annyang.setLanguage('ru');

    // const regExp = new RegExp('(' + this.keywords + ')', 'i');
    // // const commandCallback = (word) => word;
    // const commandCallback = (word) => {
    //   this.keyword = word;
    //   return word;
    // };
    // this.annyang.addCommands({
    //   ':word': {
    //     regexp: regExp,
    //     callback: commandCallback,
    //   },
    // });

    // this.annyang.addCallback('start', (userSaid, commandText, phrases) => {
    //   console.log(userSaid);
    //   console.log(commandText);
    //   console.log(phrases);
    //   if (userSaid && userSaid[0]) {
    //     console.log('a: ', userSaid[0]);
    //   }
    // });

    this.annyang.addCallback('result', (userSaid, commandText, phrases) => {
      // this.clearTimeoutCheckingVoice();
      // console.log(userSaid);

      this.speech = userSaid[0];

      this.onResultCallback.apply(this);

      // if (this.continueSpeech === this.speech) {
      //   this.continueSpeech = this.speech;
      //   this.onResultCallback.apply(this);
      // } else {
      //   this.continueSpeech += this.speech;
      //   this.onContinueVoiceCallback.apply(this);
      // }

      const words = this.speech.split(' ');

      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();
        const binaryResult = BinarySearch(word, this.keywords);

        if (binaryResult >= 0) {
          console.log(word);
          this.keyword = word;
          // eslint-disable-next-line no-useless-call
          this.onResultMatchCallback.apply(this, [this.keyword]);
          break;
        }
      }

      // this.setTimeoutCheckingVoice();
    });

    // this.annyang.addCallback(
    //   'resultMatch',
    //   (userSaid, commandText, phrases) => {
    //     this.speech = userSaid[0];
    //     // eslint-disable-next-line no-useless-call
    //     this.onResultMatchCallback.apply(this, [this.keyword]);
    //   }
    // );

    // this.annyang.start({ autoRestart: true, continuous: true });
    this.annyang.start({ autoRestart: true, continuous: false });
  }

  setTimeoutCheckingVoice() {
    this.timeoutCheckingVoice = setTimeout(() => {
      this.isNewVoice = this.oldSpeech === this.speech;

      if (this.oldSpeech !== this.speech) {
        console.log('NOPE');
        this.oldSpeech = this.speech;
      } else {
        console.log('YEP');
      }
    }, 2000);
  }

  clearTimeoutCheckingVoice() {
    if (this.timeoutCheckingVoice) clearTimeout(this.timeoutCheckingVoice);
  }
}

function BinarySearch(t, A) {
  var i = 0;
  var j = A.length;
  var k;

  while (i < j) {
    k = Math.floor((i + j) / 2);
    if (t <= A[k]) j = k;
    else i = k + 1;
  }

  if (A[i] === t) return i;
  else return -1;
}

// export default class Voice {
//   constructor(grammar) {
//     this._isSupport = window.SpeechRecognition =
//       // eslint-disable-next-line no-undef
//       window.SpeechRecognition || webkitSpeechRecognition;

//     this.grammar = this._getGrammar(grammar);
//     this.speech = '';

//     this._isFocusWindow = true;
//     // callbacks
//     this.onResultCallback = () => {};

//     if (this._isSupport) {
//       this.init();
//     }
//   }

//   init() {
//     // eslint-disable-next-line no-undef
//     this.recognition = new SpeechRecognition();
//     // this.recognition.interimResults = true;
//     this.recognition.continuous = true;
//     this.recognition.interimResults = false;
//     // this.recognition.lang = 'ru-RU';
//     this.recognition.lang = 'en-US';
//     this.grammar =
//       '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';

//     this.recognitionList = new webkitSpeechGrammarList();
//     this.recognitionList.addFromString(this.grammar, 1);

//     this.recognition.grammars = this.recognitionList;
//     console.log(this.grammar);
//     console.log(this.recognitionList);

//     this.recognition.addEventListener('result', (e) => this.onResult(e));
//     this.recognition.addEventListener('end', () => this.onEnd());
//     this.recognition.start();
//   }

//   onResult(e) {
//     console.log(e);

//     this.speech = Array.from(e.results)
//       .map((result) => result[0])
//       .map((result) => result.transcript)
//       .join('');

//     if (e.results[0].isFinal) {
//       this.onResultCallback.apply(this);
//     }
//   }

//   onEnd() {
//     if (this._isFocusWindow) {
//       this.recognition && this.recognition.start();
//     }
//   }

//   destroy() {
//     this.recognition.removeEventListener('result', (e) => this.onResult(e));
//     this.recognition.removeEventListener('end', () => this.onEnd());
//     this.recognition.abort();
//     this.recognition = null;
//   }

//   _getGrammar(str) {
//     if (!str) return false;
//     return (
//       '#JSGF V1.0; grammar words; public <word> = ' +
//       str.replaceAll(',', ' | ') +
//       ';'
//     );
//   }
// }
