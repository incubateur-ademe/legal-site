import { LRUCache } from "lru-cache";

import { ensure } from "@/utils/function";
import { type Any } from "@/utils/types";

import { type UseCase } from "./types";

export interface CachedUseCaseOptions {
  /**
   * In seconds.
   * @default 30
   */
  revalidate?: number;
}

const GLOBAL_CACHE = new Map<string, LRUCache<string, Any>>();
const DEFAULT_KEY = "__default_key___";

/**
 * When extended, give cache capabilities with the stale-while-revalidate pattern.
 *
 * `cachedExecute()` method must be implemented instead of `execute()` which will be implicitly called.
 *
 * Default revalidate is 30 seconds.
 */
export abstract class AbstractCachedUseCase<TRequest, TResponse extends object>
  implements UseCase<TRequest, TResponse>
{
  protected debug = false;
  protected abstract cacheMasterKey: string;
  protected defaultOptions: CachedUseCaseOptions = {
    // TODO: make it globaly configurable?
    revalidate: 30,
  };

  protected abstract cachedExecute(request: TRequest): Promise<TResponse>;
  public async execute(request: TRequest, options = this.defaultOptions): Promise<TResponse> {
    const cache = this.getCache(options);
    const cacheKey = this.getCacheKey(request);
    const status: LRUCache.Status<TResponse> = {};
    const hasValue = cache.has(cacheKey, { status });

    if (!hasValue) {
      const pResult = this.cachedExecute(request);
      if (status.has === "stale") {
        this.debug && console.info(`[Cache][${this.cacheMasterKey}] Cache hit but stale`, request);
        void pResult.then(result => cache.set(cacheKey, result));

        return cache.get(cacheKey, { allowStale: true })!;
      }

      this.debug && console.info(`[Cache][${this.cacheMasterKey}] Cache miss`, request);
      return pResult.then(result => {
        cache.set(cacheKey, result);
        return result;
      });
    }

    const result = cache.get(cacheKey)!;
    this.debug && console.info(`[Cache][${this.cacheMasterKey}] Cache hit`, { request, result });
    return result;
  }

  private getCacheKey(param: TRequest) {
    return ensure(() => JSON.stringify(param), DEFAULT_KEY);
  }

  private getCache({ revalidate = 30 } = this.defaultOptions) {
    if (!GLOBAL_CACHE.has(this.cacheMasterKey)) {
      GLOBAL_CACHE.set(
        this.cacheMasterKey,
        new LRUCache<string, TResponse>({
          max: 250,
          updateAgeOnGet: false,
          updateAgeOnHas: false,
          allowStale: false,
          ttl: 1000 * revalidate,
        }),
      );
    }
    return GLOBAL_CACHE.get(this.cacheMasterKey) as LRUCache<string, TResponse>;
  }
}
