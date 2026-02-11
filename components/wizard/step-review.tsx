'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database, Key, FileText, Layers, CheckCircle } from 'lucide-react';

export function StepReview() {
    const {
        selectedDatasource,
        selectedCredential,
        selectedReportTemplates,
        levelHierarchy,
        selectedLevelValues
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
                {/* Datasource & Credential */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <Database className="h-4 w-4" /> Datasource
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold">{selectedDatasource?.display_name}</div>
                        <div className="text-sm text-muted-foreground">{selectedDatasource?.slug}</div>

                        <Separator className="my-4" />

                        <div className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2 mb-2">
                            <Key className="h-4 w-4" /> Credential
                        </div>
                        <div className="font-medium">{selectedCredential?.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {selectedCredential?.id}</div>
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
                        <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {selectedReportTemplates.map(t => (
                                <li key={t.id} className="text-sm bg-muted/30 p-2 rounded flex justify-between">
                                    <span>{t.name}</span>
                                    <span className="text-xs text-muted-foreground">{t.id}</span>
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
                            const values = selectedLevelValues[level.level_id];
                            return (
                                <div key={level.level_id} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                        {i !== levelHierarchy.length - 1 && (
                                            <div className="w-[1px] h-full bg-border -mb-2 mt-1 min-h-[20px]" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                                            {level.level_name}
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
