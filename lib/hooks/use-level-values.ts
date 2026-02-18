import { useQuery } from '@tanstack/react-query';
import { poster } from '@/lib/api-client';
import { LevelValue } from '@/lib/types';

interface LevelValuesResponse {
    values: LevelValue[]; // Assumption: key is "values" or similar
}

export function useLevelValues(levelId?: number, credentialId?: number, parentPayload?: any[], enabled: boolean = true) {
    return useQuery({
        queryKey: ['level-values', levelId, credentialId, parentPayload],
        queryFn: async () => {
            const body = (parentPayload && parentPayload.length > 0)
                ? { level: parentPayload[0] }
                : undefined;

            const data = await poster<any>(
                `/api/v1/templates/levels/${levelId}/credentials/${credentialId}`,
                body
            );

            // Heuristic to find the array if we are unsure of the key
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.values)) return data.values;
            if (data && Array.isArray(data.level_values)) return data.level_values;
            if (data && Array.isArray(data.data)) return data.data; // recursive data.data?

            // If we can't find it, return empty array to prevent crash
            console.warn('Unknown structure for level values:', data);
            return [];
        },
        enabled: !!levelId && !!credentialId && enabled,
    });
}
