import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { ReportLevel } from '@/lib/types';

interface ReportLevelsResponse {
    data: [
        level: ReportLevel[] // Assumption: key is "levels"
    ];
}

export function useReportLevels(datasourceSlug?: string, reportIds?: number[]) {
    return useQuery({
        queryKey: ['report-levels', datasourceSlug, reportIds],
        queryFn: async () => {
            // The fetcher extracts response.data.data
            // We expect that to be { level: [...] } or { levels: [...] } based on API patterns
            const data = await fetcher<any>(`/api/v1/templates/${datasourceSlug}/levels`, {
                'templates': reportIds?.join(',') || ''
            });

            // Handle different possible response structures
            if (data && Array.isArray(data[0]?.level)) return data[0].level;

            // Always return an array, never undefined
            console.warn('Unexpected report levels response structure:', data);
            return [];
        },
        enabled: !!datasourceSlug && reportIds && reportIds.length > 0,
    });
}
