import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { LevelValue } from '@/lib/types';

interface LevelValuesResponse {
    values: LevelValue[]; // Assumption: key is "values" or similar
}

export function useLevelValues(levelId?: number, credentialId?: number) {
    return useQuery({
        queryKey: ['level-values', levelId, credentialId],
        queryFn: async () => {
            // Endpoint: /api/v1/default-report/levels/{level_id}/credentials/{creds_id}
            // Pattern suggests { values: [...] } or { level_values: [...] }
            // For now, let's cast to any and inspect or return safely
            const data = await fetcher<any>(`/api/v1/default-report/levels/${levelId}/credentials/${credentialId}`);

            // Heuristic to find the array if we are unsure of the key
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.values)) return data.values;
            if (data && Array.isArray(data.level_values)) return data.level_values;
            if (data && Array.isArray(data.data)) return data.data; // recursive data.data?

            // If we can't find it, return empty array to prevent crash
            console.warn('Unknown structure for level values:', data);
            return [];
        },
        enabled: !!levelId && !!credentialId,
    });
}
