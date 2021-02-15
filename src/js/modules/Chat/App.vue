<template>
  <div 
    id="app" 
    class="chat" 
    :class="{ 'chat--voice': isStartVoice }"
  >
    <div ref="scrollContainer" :class="{'has-scroll': isHasScroll}" class="chat__inner">
      <div class="chat__content">
        <div class="chat__dialog">
          <transition-group tag="div" class="transition-group" name="chat-message">
            <Message 
              v-for="message in messages"
              :key="message.id"
              :id="message.id"
              :name="message.name"
              :text="message.text"
              :srcImg="message.isBot ? imgBot : imgMan"
              :class="{
                'chat-message--bot': message.isBot
              }"
            />
          </transition-group>
        </div>
      </div>
    </div>

    <div class="chat__footer">
      <div class="chat__footer-wrap">
        <div class="chat__buttons">
          <button
          :class="{small:isStartVoice}"
            class="button button--big button--gray"
            type="button"
          >
            Выйти
          </button>
          <button @click="startVoice" v-if="!isStartVoice" class="button button--big" type="button">
            Начать чат
          </button>
        </div>

        <div 
          :class="{
            visible:isStartVoice,
            'waiting-bot': isWaitingBot
          }" 
          class="chat__status-wrapper"
        >
          <div class="chat__status chat__status--voice">
            <div class="speech-visual">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <span class="chat__status-text">
              Панда слушает
            </span>
          </div>

          <div class="chat__status chat__status--bot">
            <div class="waiting-visual">
              <i></i>
              <i></i>
              <i></i>
            </div>

            <span class="chat__status-text">
              Панда печатает ответ
            </span>
          </div>
        </div>
      </div>

      <div data-reaction class="chat__img-wrapper">
        <div data-reaction-wrap class="chat__imgs">
          <ReactionImg 
            v-for="image in images"
            :key="image.id"
            :id="image.id"
            :src="image.src"
            :reaction="image.reaction"
            :isShow="image.reaction === curReaction"
            :class="{
              'active': image.reaction === curReaction
            }"
          />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
// media
import svg1 from '../../../img/panda.svg';
import svg2 from '../../../img/logo-part.svg';

// components
import Message from './components/Message.vue';
import ReactionImg from './components/Reaction.vue';
// modules
import Voice from './modules/Voice.js';
import SpeechVisual from './modules/SpeechVisual.js';

export default {
  components: {
    Message,
    ReactionImg
  },
 
  data() {
    return {
      messages: [],
      answers: [],
      images: [],
      isStartVoice: false,
      isWaitingBot: false,
      isHasScroll: false,
      imgBot: '',
      imgMan: '',
      curReaction: 'default'
    }
  },

  created() {
    this.voice = null;
    this.speechVisual = null;
    this.voiceReaction = null;

    this.timeoutReaction = null;
    this.timeoutAnswer = null;

    this.isToRequestAnswer = true;

    this.media = window.matchMedia('(max-width: 900px)').matches;

    this.createMessage(true, 'Бот', 'Привет! Что тебя беспокоит?');
  },

  mounted() {
    this.isHasScroll = this.$refs.scrollContainer && this.$refs.scrollContainer.scrollHeight > this.$refs.scrollContainer.clientHeight;

    this.$elWrap = document.querySelector('.chat-wrap');
    this.url = this.$elWrap.getAttribute('data-url');
    this.urlKeywords = this.$elWrap.getAttribute('data-url-keywords');
    this.urlImages = this.$elWrap.getAttribute('data-url-images');
    this.urlAnswers = this.$elWrap.getAttribute('data-url-answers');
    this.imgBot = this.$elWrap.getAttribute('data-src-bot');
    this.imgMan = this.$elWrap.getAttribute('data-src-man');
    this.delayBadReaction = +this.$elWrap.getAttribute('data-delay-bad-reaction');
    this.delayAnswer = +this.$elWrap.getAttribute('data-delay-answer');
    this.keywords = [];

    this.requestKeywords();
    this.requestImages();
  },

  methods: {
    async requestAnswers(keyword) {
      
      const obj = {
        text: keyword
      }
      try {
        const response = await fetch(this.urlAnswers, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(obj)
        });

        this.answers = await response.json();
      } catch (error) {
        console.error(error);
        this.answers = {
          text: "[заглушка].",
          reaction: "good"
        }
      }
    },

    async requestKeywords() {
      try {
        const response = await fetch(this.urlKeywords);
        this.keywords = await response.json();

        console.log(this.keywords);
      } catch (error) {
        console.error(error);
        this.keywords = ["Заглушка"]
      }
    },

    async requestImages() {
      try {
        const response = await fetch(this.urlImages);
        const json = await response.json();
        for (const key in json) {
          const img = {
            id: this.images.length,
            reaction: key,
            src: json[key]
          }
          
          this.images.push(img);
        }
        

      } catch (error) {
        console.error(error);
      }
    },

    async resultMatchCalback(keyword) {
      // if (!this.isToRequestAnswer) return false;
      await this.requestAnswers(keyword);

      this.isWaitingBot = true;
      this.isSilence = false;

      setTimeout(() => {
        this.createMessage(true, 'Бот', this.answers.text);

        this.isWaitingBot = false;
        this.isSilence = true;

        this.curReaction = this.answers.reaction || 'default';

        this.isToRequestAnswer = false;
        this.setAnswerTimeout();
      }, 100);
    },
    
    startVoice() {
      this.isStartVoice = true;
      this.isToRequestAnswer = true;
      this.voice = new Voice(this.keywords);
      window.voice = this.voice;

      if (!this.media) {
        this.speechVisual = new SpeechVisual();
        window.speechVisual = this.speechVisual;
      }

      this.voice.onResultCallback = () => this.resultCalback();
      this.voice.onResultMatchCallback = (keyword) => this.resultMatchCalback(keyword);
      // this.voice.onContinueVoiceCallback = (keyword) => this.continueVoiceCallback(keyword);

      this.setReactionTimeout();
    },

    resultCalback() {
      this.curReaction = 'default';
      this.clearReactionTimeout();
      this.createMessage(false, 'Вы', this.voice.speech);
      this.setReactionTimeout();
    },

    createMessage(isBot, name, text) {
      const message = {
        id: this.messages.length,
        isBot,
        name,
        text
      }

      this.messages.push(message);
    },

    continueVoiceCallback() {
      this.editLastMessage(this.voice.continueSpeech)
    },

    editLastMessage(text) {
      const cloneLastMessage = this.messages[this.messages.length - 1];

      if (!cloneLastMessage.isBot) {
        this.messages[this.messages.length - 1].text = text;
      } else {
        console.error('Error: Last Message is Bot!');
        this.createMessage(false, 'Вы', this.voice.speech);
      }

    },

    checkScrollContainer() {
      this.$refs.scrollContainer.scrollTo({
        top: this.$refs.scrollContainer.scrollHeight,
        behavior: "smooth"
      });
    },

    setReactionTimeout() {
      this.timeoutReaction = setTimeout(() => {
        this.curReaction = 'bad';
      }, this.delayBadReaction);
    },

    clearReactionTimeout() {
      if (this.timeoutReaction) clearTimeout(this.timeoutReaction);
    },

    setAnswerTimeout() {
      this.timeoutAnswer = setTimeout(() => {
        this.isToRequestAnswer = true;
      }, this.delayAnswer);
    },

    clearAnswerTimeout() {
      if (this.timeoutAnswer) clearTimeout(this.timeoutAnswer);
    }
  },

  watch: {
    async messages(val) {
      await this.$nextTick();
      this.checkScrollContainer();

      this.isHasScroll = this.$refs.scrollContainer && this.$refs.scrollContainer.scrollHeight > this.$refs.scrollContainer.clientHeight;
    },
  },

  beforeDestroy() {
    this.voice && this.voice.destroy();
    this.speechVisual && this.speechVisual.destroy();
    this.clearReactionTimeout();
  }
}
</script>