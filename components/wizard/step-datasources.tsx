'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { useDatasources } from '@/lib/hooks/use-datasources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Database, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function StepDatasources() {
    const { selectedDatasource, selectDatasource } = usePipelineStore();
    const { data: datasources, isLoading, isError } = useDatasources();
    const [search, setSearch] = useState('');

    // SAFEGUARD: Check if datasources is actually an array
    const filteredDatasources = Array.isArray(datasources)
        ? datasources.filter(ds =>
            ds.display_name.toLowerCase().includes(search.toLowerCase()) ||
            ds.slug.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={Database}
                title="Failed to load datasources"
                description="There was an error connecting to the API. Please try again later."
            />
        );
    }

    // If datasources loaded but is not an array or empty
    if (!datasources || (Array.isArray(datasources) && datasources.length === 0)) {
        return (
            <EmptyState
                icon={Database}
                title="No datasources found"
                description="There are no datasources available in your workspace."
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search datasources..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {filteredDatasources.map((ds) => {
                    const isSelected = selectedDatasource?.id === ds.id;

                    return (
                        <Card
                            key={ds.id}
                            className={cn(
                                "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md relative overflow-hidden group",
                                isSelected ? "border-primary ring-1 ring-primary bg-primary/5" : "border-muted"
                            )}
                            onClick={() => selectDatasource(ds)}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-lg overflow-hidden p-1">
                                    {/* Fallback icon if logo_url is missing or fails */}
                                    {ds.logo_url ? (
                                        <img src={ds.logo_url} alt={ds.display_name} className="h-full w-full object-contain" />
                                    ) : (
                                        <Database className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base truncate pr-6">{ds.display_name}</CardTitle>
                                    <span className="text-xs text-muted-foreground px-0.5 rounded bg-muted/50 w-fit mt-1">
                                        {ds.slug}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {ds.status && (
                                    <Badge variant={ds.status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-5">
                                        {ds.status}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredDatasources.length === 0 && (
                <EmptyState
                    title="No matching datasources"
                    description="Try adjusting your search terms."
                />
            )}
        </div>
    );
}
