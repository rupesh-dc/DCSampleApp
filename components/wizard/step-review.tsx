'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database, Key, FileText, Layers, CheckCircle, User, Calendar } from 'lucide-react';

export function StepReview() {
    const {
        selectedDatasource,
        selectedCredential,
        selectedReportTemplates,
        levelHierarchy,
        selectedLevelValues,
        clientName,
        schedules
    } = usePipelineStore();

    return (
        <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-primary-foreground text-black dark:text-white">
                    Review your configuration below before submitting.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Attributes */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <Database className="h-4 w-4" /> Configuration Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2 mb-1">
                                <User className="h-3 w-3" /> Client Name
                            </div>
                            <div className="text-lg font-semibold">{clientName || "N/A"}</div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2 mb-1">
                                    <Database className="h-3 w-3" /> Datasource
                                </div>
                                <div className="font-semibold">{selectedDatasource?.display_name}</div>
                                <div className="text-xs text-muted-foreground truncate" title={selectedDatasource?.slug}>{selectedDatasource?.slug}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-2 mb-1">
                                    <Key className="h-3 w-3" /> Credential
                                </div>
                                <div className="font-semibold">{selectedCredential?.name}</div>
                                <div className="text-xs text-muted-foreground">ID: {selectedCredential?.id}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Selected Reports ({selectedReportTemplates.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {selectedReportTemplates.map(t => (
                                <li key={t.id} className="text-sm bg-muted/30 p-2 rounded flex flex-col gap-1">
                                    <div className="flex justify-between font-medium">
                                        <span>{t.dataset_name}</span>
                                        <span className="text-xs text-muted-foreground">ID: {t.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {schedules[t.id] ? (
                                            <span className="font-mono bg-background px-1 rounded border">{schedules[t.id]}</span>
                                        ) : (
                                            <span className="italic">Manual Run (No Schedule)</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Hierarchy */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Configuration Levels
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {levelHierarchy.map((level, i) => {
                            const values = selectedLevelValues[level.id];
                            return (
                                <div key={level.id} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                        {i !== levelHierarchy.length - 1 && (
                                            <div className="w-[1px] h-full bg-border -mb-2 mt-1 min-h-[20px]" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                                            {level.name}
                                        </div>
                                        <div className="font-medium">
                                            {values && values.length > 0
                                                ? values.map(v => v.name || v.id || v).join(', ')
                                                : <span className="text-muted-foreground italic">Not selected</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {levelHierarchy.length === 0 && (
                            <div className="text-sm text-muted-foreground italic">No hierarchy levels configured.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
