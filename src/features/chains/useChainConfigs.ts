import { useEffect } from 'react';
import { z } from 'zod';

import { ChainMap, ChainMetadata, ChainMetadataSchema, objMerge } from '@hyperlane-xyz/sdk';

import { useStore } from '../../store';
import { fromBase64 } from '../../utils/base64';
import { logger } from '../../utils/logger';
import { useQueryParam } from '../../utils/queryParams';

import { ChainConfig } from './chainConfig';

const CHAIN_CONFIGS_KEY = 'chains';

const ChainMetadataArraySchema = z.array(ChainMetadataSchema);

// Use the chainConfigs from the store
export function useChainConfigs() {
  return useStore((s) => ({
    chainConfigs: s.chainConfigsV2,
    setChainConfigs: s.setChainConfigs,
  }));
}

// Use the chainConfigs from the store but with any
// chainConfigs from the query string merged in
export function useChainConfigsWithQueryParams() {
  const { chainConfigs: storeConfigs, setChainConfigs } = useChainConfigs();
  const queryVal = useQueryParam(CHAIN_CONFIGS_KEY);

  useEffect(() => {
    if (!queryVal) return;
    const decoded = fromBase64<ChainMetadata[]>(queryVal);
    if (!decoded) {
      logger.error('Unable to decode chain configs in query string');
      return;
    }
    const result = ChainMetadataArraySchema.safeParse(decoded);
    if (!result.success) {
      logger.error('Invalid chain configs in query string', result.error);
      return;
    }
    const chainMetadataList = result.data as ChainMetadata[];

    // Stop here if there are no new configs to save, otherwise the effect will loop
    if (!chainMetadataList.length || chainMetadataList.every((c) => !!storeConfigs[c.name])) return;

    const nameToChainConfig = chainMetadataList.reduce<ChainMap<ChainConfig>>(
      (acc, chainMetadata) => {
        // TODO would be great if we could get contract addrs here too
        // But would require apps like warp template to get that from devs
        acc[chainMetadata.name] = { ...chainMetadata, contracts: { mailbox: '' } };
        return acc;
      },
      {},
    );

    const mergedConfig = objMerge(nameToChainConfig, storeConfigs) as ChainMap<ChainConfig>;
    setChainConfigs(mergedConfig);
  }, [storeConfigs, setChainConfigs, queryVal]);

  return storeConfigs;
}
