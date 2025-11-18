import type { RouteRecordRaw } from 'vue-router';

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
        path: '/turn-tracker',
        name: 'Turn Tracker',
        children: [
          {
            path: '',
            name: 'Setup',
            component: () => import('pages/TurnTracker/Setup.vue'),
          },
          {
            path: 'strategy',
            name: 'Strategy',
            component: () => import('pages/TurnTracker/Strategy.vue'),
          },
          {
            path: 'actions',
            name: 'Action',
            component: () => import('pages/TurnTracker/Action.vue'),
          },
          {
            path: 'agenda',
            name: 'Agenda',
            component: () => import('pages/TurnTracker/Agenda.vue'),
          },
        ],
      },
      {
        path: '/components/agendas',
        name: 'Agendas',
        component: () => import('pages/Components/Agendas.vue'),
      },
      {
        path: '/components/action-cards',
        name: 'ActionCards',
        component: () => import('pages/Components/ActionCards.vue'),
      },
      {
        path: '/components/objectives',
        name: 'Objectives',
        component: () => import('pages/Components/Objectives.vue'),
      },
      {
        path: '/components/exploration-cards',
        name: 'ExplorationCards',
        component: () => import('pages/Components/ExplorationCards.vue'),
      },
      {
        path: '/components/strategy-cards',
        name: 'StrategyCards',
        component: () => import('pages/Components/StrategyCards.vue'),
        props: true,
      },
      {
        path: '/components/relics',
        name: 'Relics',
        component: () => import('pages/Components/Relics.vue'),
        props: true,
      },
      {
        path: '/technology',
        name: 'Technologies',
        component: () => import('pages/Technologies.vue'),
        props: true,
      },
      {
        path: '/planets',
        name: 'Planets',
        component: () => import('pages/Planets.vue'),
        props: true,
      },
      {
        path: '/units',
        name: 'Units',
        component: () => import('pages/Units.vue'),
        props: true,
      },
      {
        path: '/technology/:techType',
        name: 'TechnologyType',
        component: () => import('pages/TechnologyType.vue'),
        props: true,
      },
      {
        path: '/components/promissory-notes',
        name: 'PromissoryNotes',
        component: () => import('pages/Components/PromissoryNotes.vue'),
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
