'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { useCredentials } from '@/lib/hooks/use-credentials';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Key } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function StepCredentials() {
    const { selectedDatasource, selectedCredential, selectCredential } = usePipelineStore();

    const {
        data: credentials,
        isLoading,
        isError
    } = useCredentials(selectedDatasource?.slug);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={Key}
                title="Failed to load credentials"
                description="There was an error loading credentials for this datasource."
            />
        );
    }

    if (!credentials || credentials.length === 0) {
        return (
            <EmptyState
                icon={Key}
                title="No credentials found"
                description={`No credentials configured for ${selectedDatasource?.display_name}. Please create a credential first.`}
            />
        );
    }

    return (
        <RadioGroup
            value={selectedCredential?.id.toString()}
            onValueChange={(val) => {
                const cred = credentials.find(c => c.id.toString() === val);
                if (cred) selectCredential(cred);
            }}
            className="space-y-3"
        >
            {credentials.map((cred) => (
                <label
                    key={cred.id}
                    htmlFor={`cred-${cred.id}`}
                >
                    <Card
                        className={cn(
                            "cursor-pointer transition-all hover:bg-muted/50",
                            selectedCredential?.id === cred.id ? "border-primary bg-primary/5" : "border-muted"
                        )}
                    >
                        <CardContent className="flex items-center space-x-4 p-4">
                            <RadioGroupItem value={cred.id.toString()} id={`cred-${cred.id}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={`cred-${cred.id}`} className="text-base font-medium cursor-pointer">
                                        {cred.name}
                                    </Label>
                                    {cred.status && (
                                        <Badge variant="outline" className="ml-2 uppercase text-[10px]">
                                            {cred.status}
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                                    <span>ID: {cred.id}</span>
                                    {cred.created_at && (
                                        <span>Created: {format(new Date(cred.created_at), 'PPP')}</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </label>
            ))}
        </RadioGroup>
    );
}
