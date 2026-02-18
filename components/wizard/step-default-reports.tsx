'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { useDefaultReports } from '@/lib/hooks/use-default-reports';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export function StepDefaultReports() {
    const { selectedDatasource, selectedReportTemplates, toggleReportTemplate } = usePipelineStore();

    const {
        data: reports,
        isLoading,
        isError
    } = useDefaultReports(selectedDatasource?.slug);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={FileText}
                title="Failed to load reports"
                description="There was an error loading default reports for this datasource."
            />
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="No default reports"
                description={`No default report templates available for ${selectedDatasource?.display_name}.`}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report: any) => {
                const isSelected = selectedReportTemplates.some(t => t.id === report.id);

                return (
                    <Card
                        key={report.id}
                        className={cn(
                            "cursor-pointer transition-all hover:bg-muted/50 border-2",
                            isSelected ? "border-primary bg-primary/5" : "border-transparent border-border"
                        )}
                        onClick={() => toggleReportTemplate(report)}
                    >
                        <CardContent className="flex items-start space-x-4 p-4">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleReportTemplate(report)}
                                className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{report.dataset_name}</h4>
                                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {report.dataset_description || "No description provided."}
                                </p>
                                {/* {report.category && (
                                    <div className="pt-2">
                                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground uppercase font-medium">
                                            {report.category}
                                        </span>
                                    </div>
                                )} */}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
