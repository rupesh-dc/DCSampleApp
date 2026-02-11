import { create } from 'zustand';
import { Datasource, Credential, ReportLevel, DefaultReportTemplate } from '@/lib/types';

export type Step = 'datasources' | 'credentials' | 'reports' | 'levels' | 'review';

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

    // Actions
    setStep: (step: Step) => void;
    selectDatasource: (datasource: Datasource) => void;
    selectCredential: (credential: Credential) => void;
    toggleReportTemplate: (template: DefaultReportTemplate) => void;
    setLevelValues: (levelId: number, values: any[]) => void;
    setLevelHierarchy: (levels: ReportLevel[]) => void;
    reset: () => void;
}

const INITIAL_STEPS: Step[] = ['datasources', 'credentials', 'reports', 'levels', 'review'];

export const usePipelineStore = create<PipelineState>((set) => ({
    currentStep: 'datasources',
    steps: INITIAL_STEPS,

    selectedDatasource: null,
    selectedCredential: null,
    selectedReportTemplates: [],
    selectedLevelValues: {},
    levelHierarchy: [],

    setStep: (step) => set({ currentStep: step }),

    selectDatasource: (datasource) => set((state) => {
        // If changing datasource, reset everything downstream
        if (state.selectedDatasource?.id !== datasource.id) {
            return {
                selectedDatasource: datasource,
                selectedCredential: null,
                selectedReportTemplates: [],
                selectedLevelValues: {},
                levelHierarchy: []
            };
        }
        return { selectedDatasource: datasource };
    }),

    selectCredential: (credential) => set({ selectedCredential: credential }),

    toggleReportTemplate: (template) => set((state) => {
        const exists = state.selectedReportTemplates.find(t => t.id === template.id);
        if (exists) {
            return {
                selectedReportTemplates: state.selectedReportTemplates.filter(t => t.id !== template.id)
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

    reset: () => set({
        currentStep: 'datasources',
        selectedDatasource: null,
        selectedCredential: null,
        selectedReportTemplates: [],
        selectedLevelValues: {},
        levelHierarchy: []
    })
}));
