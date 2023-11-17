<script setup>
import { useTornadoStore } from '../store/tornadoStore';
import data from '../assets/data.json';

const store = useTornadoStore();

store.addToArray(data);
</script>
<template>
  
</template>
