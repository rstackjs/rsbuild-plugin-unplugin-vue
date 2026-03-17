<script setup>
import './style.css';
import { ref } from 'vue';

const _button = ref('Hello World!');
</script>

<template>
  <p class="button">{{ button }}</p>
</template>

<style>
.button {
  color: blue;
}
</style>
