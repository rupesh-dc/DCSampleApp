import { useMutation } from '@tanstack/react-query';
import { poster } from '@/lib/api-client';
import { ConfiguredReportPayload } from '@/lib/types';

export function useCreateConfiguredReport(datasourceSlug?: string) {
    return useMutation({
        mutationFn: (data: ConfiguredReportPayload) =>
            poster(`/api/v1/templates/${datasourceSlug}`, data),
    });
}
