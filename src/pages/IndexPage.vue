<template>
  <q-page>
    <q-img class="q-mt-lg" src="src/assets/banner.jpg" />
    <div class="row justify-center">
      <div class="col">
        <h2 class="q-mb-sm text-center">Welcome to the TI4 Database</h2>
        <div class="text-subtitle1 q-mt-none text-center text-italic">
          Navigate with the above toolbar to find all the information you need
          to play Twilight Imperium 4th Edition
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="copyright text-caption text-center">
        Twilight Imperium © Fantasy Flight Games. Not Affiliated.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Todo, Meta } from 'components/models';
import { ref } from 'vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);
const meta = ref<Meta>({
  totalCount: 1200,
});
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 10px;
}
</style>
