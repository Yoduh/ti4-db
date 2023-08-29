import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/factions',
        name: 'Factions',
        component: () => import('pages/Factions.vue'),
      },
      {
        path: '/factions/:id',
        name: 'Faction',
        component: () => import('pages/Faction.vue'),
        props: (route) => {
          return { ...route.params, id: Number(route.params.id) };
        },
      },
      {
        path: '/components',
        name: 'Components',
        component: () => import('pages/Components.vue'),
      },
      {
        path: '/rules',
        name: 'Rules',
        component: () => import('pages/Rules.vue'),
      },
      {
        path: '/components/agendas',
        name: 'Agendas',
        component: () => import('pages/Agendas.vue'),
      },
      {
        path: '/components/action-cards',
        name: 'ActionCards',
        component: () => import('pages/ActionCards.vue'),
      },
      {
        path: '/components/objectives',
        name: 'Objectives',
        component: () => import('pages/Objectives.vue'),
      },
      {
        path: '/components/exploration-cards',
        name: 'ExplorationCards',
        component: () => import('pages/ExplorationCards.vue'),
      },
      {
        path: '/components/strategy-cards',
        name: 'StrategyCards',
        component: () => import('pages/StrategyCards.vue'),
        props: true,
      },
      {
        path: '/components/relics',
        name: 'Relics',
        component: () => import('pages/Relics.vue'),
        props: true,
      },
      {
        path: '/technology',
        name: 'Technologies',
        component: () => import('pages/Technologies.vue'),
        props: true,
      },
      {
        path: '/technology/:techType',
        name: 'TechnologyType',
        component: () => import('pages/TechnologyType.vue'),
        props: true,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
