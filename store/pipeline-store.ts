import { create } from 'zustand';
import { Datasource, Credential, ReportLevel, DefaultReportTemplate } from '@/lib/types';

export type Step = 'datasources' | 'credentials' | 'reports' | 'levels' | 'configuration' | 'review';

interface PipelineState {
    // Wizard State
    currentStep: Step;
    steps: Step[];

    // Data State
    selectedDatasource: Datasource | null;
    selectedCredential: Credential | null;
    selectedReportTemplates: DefaultReportTemplate[];

    // Levels are stored in a map for easy access by level ID
    // We store the *selected values* for each level
    selectedLevelValues: Record<number, any[]>;

    // Full hierarchy structure for reference
    levelHierarchy: ReportLevel[];

    // Configuration
    clientName: string;
    // Map of templateId -> cron string
    schedules: Record<number, string>;

    // Actions
    setStep: (step: Step) => void;
    selectDatasource: (datasource: Datasource) => void;
    selectCredential: (credential: Credential) => void;
    toggleReportTemplate: (template: DefaultReportTemplate) => void;
    setLevelValues: (levelId: number, values: any[]) => void;
    setLevelHierarchy: (levels: ReportLevel[]) => void;
    setClientName: (name: string) => void;
    setSchedule: (templateId: number, cron: string) => void;
    reset: () => void;
}

const INITIAL_STEPS: Step[] = ['datasources', 'credentials', 'reports', 'levels', 'configuration', 'review'];

export const usePipelineStore = create<PipelineState>((set) => ({
    currentStep: 'datasources',
    steps: INITIAL_STEPS,

    selectedDatasource: null,
    selectedCredential: null,
    selectedReportTemplates: [],
    selectedLevelValues: {},
    levelHierarchy: [],
    clientName: '',
    schedules: {},

    setStep: (step) => set({ currentStep: step }),

    selectDatasource: (datasource) => set((state) => {
        // If changing datasource, reset everything downstream
        if (state.selectedDatasource?.id !== datasource.id) {
            return {
                selectedDatasource: datasource,
                selectedCredential: null,
                selectedReportTemplates: [],
                selectedLevelValues: {},
                levelHierarchy: [],
                clientName: '',
                schedules: {}
            };
        }
        return { selectedDatasource: datasource };
    }),

    selectCredential: (credential) => set({ selectedCredential: credential }),

    toggleReportTemplate: (template) => set((state) => {
        const exists = state.selectedReportTemplates.find(t => t.id === template.id);
        if (exists) {
            // Also remove schedule if template is removed
            const { [template.id]: _, ...restSchedules } = state.schedules;
            return {
                selectedReportTemplates: state.selectedReportTemplates.filter(t => t.id !== template.id),
                schedules: restSchedules
            };
        }
        return {
            selectedReportTemplates: [...state.selectedReportTemplates, template]
        };
    }),

    setLevelValues: (levelId, values) => set((state) => ({
        selectedLevelValues: {
            ...state.selectedLevelValues,
            [levelId]: values
        }
    })),

    setLevelHierarchy: (levels) => set({ levelHierarchy: levels }),

    setClientName: (name) => set({ clientName: name }),

    setSchedule: (templateId, cron) => set((state) => ({
        schedules: {
            ...state.schedules,
            [templateId]: cron
        }
    })),

    reset: () => set({
        currentStep: 'datasources',
        selectedDatasource: null,
        selectedCredential: null,
        selectedReportTemplates: [],
        selectedLevelValues: {},
        levelHierarchy: [],
        clientName: '',
        schedules: {}
    })
}));
