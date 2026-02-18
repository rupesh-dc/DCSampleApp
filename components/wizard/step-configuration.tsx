'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, User } from 'lucide-react';

export function StepConfiguration() {
    const {
        clientName,
        setClientName,
        selectedReportTemplates,
        schedules,
        setSchedule
    } = usePipelineStore();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" /> Client Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="client-name">Client Name</Label>
                        <Input
                            id="client-name"
                            placeholder="Enter client name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Report Scheduling
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    {selectedReportTemplates.length === 0 ? (
                        <p className="text-muted-foreground italic">No reports selected.</p>
                    ) : (
                        selectedReportTemplates.map((template) => (
                            <div key={template.id} className="grid gap-2 border-b last:border-0 pb-4 last:pb-0">
                                <Label className="font-semibold text-base">
                                    {template.dataset_name}
                                </Label>
                                <div className="space-y-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor={`cron-${template.id}`} className="text-xs text-muted-foreground">
                                            Cron Schedule Expression
                                        </Label>
                                        <Input
                                            id={`cron-${template.id}`}
                                            placeholder="e.g. 0 16 * * *"
                                            value={schedules[template.id] || ''}
                                            onChange={(e) => setSchedule(template.id, e.target.value)}
                                            className="font-mono text-sm"
                                        />
                                        <p className="text-[10px] text-muted-foreground">
                                            Format: Minute Hour Day Month Weekday
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
