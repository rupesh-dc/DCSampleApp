import { useMutation, useQuery } from '@tanstack/react-query';
import { poster, fetcher } from '@/lib/api-client';

interface RedirectUrlResponse {
    expires_in: number;
    id: number;
    redirect_url: string;
}

export function useCreateCredentialRedirect(datasourceSlug?: string) {
    return useMutation({
        mutationFn: (redirectUrl: string) =>
            poster<RedirectUrlResponse>(
                `/api/v1/datasources/${datasourceSlug}/credentials/redirect-urls`,
                { redirect_url: redirectUrl }
            ),
    });
}
