import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api-client';
import { Credential } from '@/lib/types';

interface CredentialsResponse {
    credentials: Credential[];
}

export function useCredentials(datasourceSlug?: string) {
    return useQuery({
        queryKey: ['credentials', datasourceSlug],
        queryFn: async () => {
            const data = await fetcher<CredentialsResponse>(`/api/v1/datasources/credentials/${datasourceSlug}`);
            // Check for credentials or credentials_list to be safe, or just credentials as per user
            // User said "credentials key", so we prioritize that. 
            // Also return empty array if undefined.
            return data.credentials || [];
        },
        enabled: !!datasourceSlug,
    });
}
