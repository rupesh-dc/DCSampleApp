import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { Datasource, PaginationParams } from '@/lib/types';

interface UseDatasourcesParams extends PaginationParams {
    search?: string;
}

// Internal type for the API response structure
interface DatasourceListResponse {
    datasource_list: Datasource[];
}

export function useDatasources(params: UseDatasourcesParams = { page: 1, size: 100 }) {
    return useQuery({
        queryKey: ['datasources', params],
        queryFn: async () => {
            // The API returns { data: { datasource_list: [...] } }
            // fetcher unwrap response.data.data, so we get { datasource_list: [...] }
            const data = await fetcher<DatasourceListResponse>('/api/v1/datasources', params);
            return data.datasource_list;
        },
    });
}
