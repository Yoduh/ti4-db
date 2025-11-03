<template>
  <q-page>
    <q-img class="q-mt-lg" :src="banner" />
    <div class="row justify-center">
      <div class="col">
        <h2 class="q-mb-sm text-center">Welcome to the TI4 Database</h2>
        <div class="text-h5 q-mb-sm text-center">
          This site is up to date with Codex I-IV, Prophecy of Kings and Thunder's Edge expansions
        </div>
        <div class="text-subtitle1 q-mt-none text-center text-italic">
          Have an upcoming or ongoing game? Click the star next to each name in the Factions
          dropdown and those factions will stay sorted on top for easy access!
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="copyright text-caption text-center">
        This is an unofficial fan-made website for Twilight Imperium
        <br />All game materials, images, and information are © Fantasy Flight Games. <br />This
        site is intended for non-commercial, educational, and informational purposes only.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const banner = new URL('../assets/banner.jpg', import.meta.url).href;
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 10px;
}
</style>
