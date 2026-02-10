import { create } from 'zustand';
import { portfolioData, PortfolioData } from '@/lib/data/mockData';

interface PortfolioState {
    // Data
    data: PortfolioData;

    // UI State
    template: string;
    theme: string;
    font: string;
    deviceView: 'desktop' | 'tablet' | 'mobile';

    // Actions
    setData: (data: PortfolioData) => void;
    updateData: (partialData: Partial<PortfolioData>) => void;
    setTemplate: (template: string) => void;
    setTheme: (theme: string) => void;
    setFont: (font: string) => void;
    setDeviceView: (view: 'desktop' | 'tablet' | 'mobile') => void;

    // Deep updates
    updateProject: (index: number, project: Partial<PortfolioData['projects'][0]>) => void;
    updateExperience: (index: number, experience: Partial<PortfolioData['experience'][0]>) => void;
    addProject: (project: PortfolioData['projects'][0]) => void;
    removeProject: (index: number) => void;
    addExperience: (experience: PortfolioData['experience'][0]) => void;
    removeExperience: (index: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    // Initial State
    data: portfolioData,
    template: 'modern',
    theme: 'indigo',
    font: 'inter',
    deviceView: 'desktop',

    // Actions
    setData: (data) => set({ data }),

    updateData: (partialData) => set((state) => ({
        data: { ...state.data, ...partialData }
    })),

    setTemplate: (template) => set({ template }),
    setTheme: (theme) => set({ theme }),
    setFont: (font) => set({ font }),
    setDeviceView: (deviceView) => set({ deviceView }),

    updateProject: (index, project) => set((state) => {
        const newProjects = [...state.data.projects];
        newProjects[index] = { ...newProjects[index], ...project };
        return { data: { ...state.data, projects: newProjects } };
    }),

    updateExperience: (index, experience) => set((state) => {
        const newExperience = [...state.data.experience];
        newExperience[index] = { ...newExperience[index], ...experience };
        return { data: { ...state.data, experience: newExperience } };
    }),

    addProject: (project) => set((state) => ({
        data: { ...state.data, projects: [...state.data.projects, project] }
    })),

    removeProject: (index) => set((state) => ({
        data: { ...state.data, projects: state.data.projects.filter((_, i) => i !== index) }
    })),

    addExperience: (experience) => set((state) => ({
        data: { ...state.data, experience: [...state.data.experience, experience] }
    })),

    removeExperience: (index) => set((state) => ({
        data: { ...state.data, experience: state.data.experience.filter((_, i) => i !== index) }
    }))
}));
