<script setup>
import TorDisplayComponent from './components/TorDisplayComponent.vue';
</script>

<template>
    <div class="h-screen p-4 bg-zinc-900 text-gray-50">
        <h1 class="font-bold text-4xl">Tornado Tracker</h1>
        <p>An archive of every actual US Tornado from 1950-2022</p>
        <p class="italic">
            Note: Some tornadoes do not have an end latitude or longitude and therefore have been omitted. Tornadoes
            with an unknown rating are also omitted.
        </p>
        <TorDisplayComponent />
    </div>
</template>
