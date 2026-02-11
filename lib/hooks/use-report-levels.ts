import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { ReportLevel } from '@/lib/types';

interface ReportLevelsResponse {
    levels: ReportLevel[]; // Assumption: key is "levels"
}

export function useReportLevels(datasourceSlug?: string, reportIds?: number[]) {
    return useQuery({
        queryKey: ['report-levels', datasourceSlug, reportIds],
        queryFn: async () => {
            // The fetcher extracts response.data.data
            // We expect that to be { levels: [...] } based on patterns
            const data = await fetcher<ReportLevelsResponse>(`/api/v1/default-report/${datasourceSlug}/levels`, {
                'default-reports': reportIds?.join(',') || ''
            });
            return data.levels;
        },
        enabled: !!datasourceSlug && reportIds && reportIds.length > 0,
    });
}
