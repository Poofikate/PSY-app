<template>
  <div class="chat-message">
    <div class="chat-message__author">
      <div class="chat-message__img-wrapper">
        <img
          :src="srcImg"
          alt=""
          class="chat-message__img"
        />
      </div>
      <span class="chat-message__name">{{ name }}</span>
    </div>

    <div class="chat-message__content">
      <p class="chat-message__text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    srcImg: {
      type: String,
      required: true
    },
  }
}
</script>

