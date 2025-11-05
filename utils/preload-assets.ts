import { Asset } from 'expo-asset';
import { ASSET_PRELOAD_CONFIG } from '@/constants/assets';

// Minimal asset preloader for local image modules
export async function preloadAssets(sources: any[]): Promise<void> {
  try {
    const modules = sources.filter((src) => typeof src === 'number');
    if (modules.length > 0) {
      await Asset.loadAsync(modules as number[]);
    }
  } catch {
    // Best-effort preloading; ignore failures
  }
}

export async function preloadCriticalAssets(): Promise<void> {
  await preloadAssets(ASSET_PRELOAD_CONFIG.critical as any[]);
}

