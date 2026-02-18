'use client';

import { usePipelineStore } from '@/store/pipeline-store';
import { useReportLevels } from '@/lib/hooks/use-report-levels';
import { useLevelValues } from '@/lib/hooks/use-level-values';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Layers, ChevronRight, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


// Recursive component for rendering levels
function LevelSelector({
    level,
    credentialId,
    selectedValues,
    onChange,
    disabled
}: {
    level: any,
    credentialId: number,
    selectedValues: Record<number, any[]>,
    onChange: (levelId: number, values: any[]) => void,
    disabled: boolean
}) {
    // console.log('Rendering LevelSelector for level:', level, 'with credentialId:', credentialId, 'and selectedValues:', selectedValues);

    const levelId = level.id;
    const currentSelection = selectedValues[levelId] || [];

    // Construct parentPayload from the parent's selected values
    const parentId = level.parent_level_id;
    const parentSelection = parentId ? selectedValues[parentId] : [];

    // Map to include only id and name as requested
    const parentPayload = parentSelection?.map(val => ({
        id: val.id || val,
        name: val.name || val
    }));

    // Only fetch if not disabled (meaning parent is selected or it is root)
    const { data: values, isLoading, isError } = useLevelValues(levelId, credentialId, parentPayload, !disabled);

    return (
        <div className="relative border-l-2 border-muted pl-6 pb-6 last:pb-0">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted border-2 border-background ring-1 ring-muted mb-2" />

            <div className="space-y-3">
                <Label className="text-base font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    {level.name || level.level_name}
                </Label>

                {isError ? (
                    <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Failed to load values</AlertDescription>
                    </Alert>
                ) : (
                    <Select
                        disabled={disabled || isLoading}
                        value={currentSelection.length > 0 ? (currentSelection[0]?.id || currentSelection[0]) : undefined}
                        onValueChange={(val) => {
                            // Find the full object
                            const selectedObj = values?.find((v: any) => (v.id || v) === val);
                            if (selectedObj) onChange(levelId, [selectedObj]);
                        }}
                    >
                        <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder={isLoading ? "Loading values..." : `Select ${level.name || level.level_name}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {values?.map((val: any) => {
                                const id = val.id || val;
                                const name = val.name || val;
                                return (
                                    <SelectItem key={id} value={id}>
                                        {name}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
}

export function StepReportLevels() {
    const {
        selectedDatasource,
        selectedReportTemplates,
        selectedCredential,
        setLevelHierarchy,
        levelHierarchy,
        selectedLevelValues,
        setLevelValues
    } = usePipelineStore();

    // Fetch hierarchy structure
    const reportIds = selectedReportTemplates.map(t => t.id);
    const {
        data: levels,
        isLoading,
        isError
    } = useReportLevels(selectedDatasource?.slug, reportIds);

    // Sync levels to store when loaded
    useEffect(() => {
        if (levels) {
            setLevelHierarchy(levels);
        }
    }, [levels, setLevelHierarchy]);

    if (isLoading) {
        return (
            <div className="space-y-8 p-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full max-w-md" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={Layers}
                title="Failed to load hierarchies"
                description="Could not fetch the level structure for the selected reports."
            />
        );
    }

    if (!levels || levels.length === 0) {
        return (
            <EmptyState
                icon={Layers}
                title="No configuration needed"
                description="The selected reports do not require any hierarchical configuration."
            />
        );
    }

    if (!selectedCredential) return null; // Should not happen due to wizard guards

    return (
        <Card className="border-none shadow-none" >
            <CardContent className="space-y-2 pt-2">
                {levels.map((level: any) => {
                    // Logic: A level is enabled only if its parent level has a selection (or if it's the root)
                    const isRoot = !level.parent_level_id;
                    const parentHasSelection = selectedLevelValues[level.parent_level_id]?.length > 0;
                    const isEnabled = isRoot || parentHasSelection;

                    return (
                        <LevelSelector
                            key={level.id}
                            level={level}
                            credentialId={selectedCredential.id}
                            selectedValues={selectedLevelValues}
                            onChange={setLevelValues}
                            disabled={!isEnabled}
                        />
                    );
                })}
            </CardContent>
        </Card>
    );
}
