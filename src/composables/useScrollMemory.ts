import { watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Remembers and restores scroll position when switching between The Firmament and The Obsidian faction pages
 */
const scrollPositions: Record<string, number> = {};
export function useScrollMemory(): void {
  const route = useRoute();

  watch(
    () => route.fullPath,
    (newPath, oldPath) => {
      if (
        (oldPath === '/factions/29' || oldPath === '/factions/28') &&
        (newPath === '/factions/29' || newPath === '/factions/28')
      ) {
        scrollPositions[oldPath] = window.scrollY;
        setTimeout(() => {
          window.scrollTo({ top: scrollPositions[oldPath] ?? 0 });
        }, 0);
      }
    },
  );
}
