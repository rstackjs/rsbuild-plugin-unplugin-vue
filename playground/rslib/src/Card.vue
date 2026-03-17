<script setup>
import { ref } from 'vue';

const _card = ref('Hello World!');
</script>

<template>
  <p class="card">{{ card }}</p>
</template>

<style>
.card {
  color: red;
  font-weight: bold;
}
</style>
