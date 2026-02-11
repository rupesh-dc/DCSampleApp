import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { DefaultReportTemplate } from '@/lib/types';

interface DefaultReportsResponse {
    default_reports: DefaultReportTemplate[];
}

export function useDefaultReports(datasourceSlug?: string) {
    return useQuery({
        queryKey: ['default-reports', datasourceSlug],
        queryFn: async () => {
            // API call structure:
            // The fetcher returns response.data.data.
            // Logs show response.data is Array(0) or empty array.
            // If the API returns { message: "Success", data: [] }, then fetcher returns [].
            // In that case, we should just return that array.

            const data = await fetcher<any>(`/api/v1/default-report/${datasourceSlug}`, {
                'default-reports': 'all'
            });

            // If data is already an array, it's the reports list
            if (Array.isArray(data)) return data;

            // If it's an object with default_reports key
            if (data && Array.isArray(data.default_reports)) return data.default_reports;

            // Fallback
            return [];
        },
        enabled: !!datasourceSlug,
    });
}
