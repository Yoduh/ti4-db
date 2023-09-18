<template>
  <div id="rules">
    <q-input
      v-model="search"
      filled
      @update:model-value="searchRules"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <div v-for="header in filteredTree" :key="header.id" class="q-mb-md">
      <div v-for="(half, idx) in formatHeader(header)" :key="idx">
        <h5 v-if="idx === 0" class="q-mb-none">
          <span class="ref header-ref">{{ header.ref }}</span
          >{{ half }}
        </h5>
        <div v-else>{{ half }}</div>
      </div>
      <div v-for="rule in header.children" :key="rule.id">
        <h6 v-if="rule.category === 'subheader'" class="q-my-none">
          <strong class="ref subheader-ref">{{ rule.ref }}</strong
          >{{ rule.text }}
        </h6>
        <div v-else-if="rule.category === 'rule'">
          <strong class="ref rule-ref">{{ rule.ref }}</strong
          >{{ rule.text }}
        </div>
        <div v-else>
          <ul class="q-my-sm">
            <li>{{ rule.text }}</li>
          </ul>
        </div>
        <div v-for="subrule in rule.children" :key="subrule.id">
          <ul class="q-my-sm">
            <li>{{ subrule.text }}</li>
          </ul>
        </div>
      </div>
    </div>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
  </div>
</template>

<script setup lang="ts">
import { Rule, RuleNode } from 'components/models';
import { api } from '@/boot/axios';
import { ref, reactive } from 'vue';

const rules = ref<Rule[]>([]);
const filteredTree = ref<RuleNode[]>([]);
const ruleTree = reactive<RuleNode[]>([]);

api.get('/rule').then((res) => {
  rules.value = res.data;

  const idMapping = res.data.reduce(
    (acc: { [key: string]: number }, el: Rule, i: number) => {
      acc[el.ref] = i;
      return acc;
    },
    {}
  );

  let root;
  res.data.forEach((el: Rule) => {
    // Handle the root element
    if (el.parentRef === null) {
      root = el;
      ruleTree.push(root);
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = res.data[idMapping[el.parentRef]];
    // Add our current el to its parent's children array
    parentEl.children = [...(parentEl.children || []), el];
  });

  filteredTree.value = ruleTree;
});

function formatHeader(rule: Rule) {
  return rule.text.split('\n');
}

const search = ref('');

function searchRules() {
  filteredTree.value = ruleTree;
  if (search.value.length < 3) {
    return;
  }

  // if search.value is a decimal, search the refs only

  filteredTree.value.forEach((header) => {
    let headerTitle = header.text.split('\n')[0].toLocaleLowerCase();
    if (headerTitle.includes(search.value.toLowerCase())) {
      header.relevance = 4;
    } else {
      header.relevance = 0;
    }

    if (header.children) {
      header.children.forEach((rule) => {
        if (rule.text.toLowerCase().includes(search.value.toLowerCase())) {
          if (rule.category === 'subheader') {
            header.relevance = 3;
          } else if (
            rule.category === 'rule' &&
            (!header.relevance || header.relevance < 2)
          ) {
            header.relevance = 2;
          }
        } else if (rule.children) {
          rule.children.forEach((subrule) => {
            if (
              subrule.text.toLowerCase().includes(search.value.toLowerCase()) &&
              !header.relevance
            ) {
              header.relevance = 1;
            }
          });
        }
      });
    }
  });

  filteredTree.value = filteredTree.value
    .filter((h) => h.relevance! > 0)
    .sort((a, b) => b.relevance! - a.relevance!);
}
</script>

<style scoped>
.ref {
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
  margin-right: 16px;
}
.rule-ref {
  font-size: 0.75rem;
}
.header-ref {
  font-size: 1.2rem;
}
.subheader-ref {
  font-size: 1rem;
}
</style>
