export interface Template {
    id: string;
    name: string;
    description: string;
    category: 'Minimal' | 'Creative' | 'Professional';
    image: string;
    isPremium: boolean;
    isNew?: boolean;
    isPopular?: boolean;
}

export const templates: Template[] = [
    {
        id: 'modern-v1',
        name: 'Modern Dev',
        description: 'Clean and professional layout focused on code projects and technical skills.',
        category: 'Professional',
        image: '/templates/modern.png',
        isPremium: false,
        isPopular: true
    },
    {
        id: 'minimal-mono',
        name: 'Mono Focus',
        description: 'A minimalist, typography-driven theme perfect for content-heavy portfolios.',
        category: 'Minimal',
        image: '/templates/minimal.png',
        isPremium: false,
    },
    {
        id: 'creative-studio',
        name: 'Artisan',
        description: 'Bold colors and large imagery for designers and creative developers.',
        category: 'Creative',
        image: '/templates/creative.png',
        isPremium: true,
        isNew: true
    },
    {
        id: 'timeline-pro',
        name: 'Career Path',
        description: 'Timeline-based layout highlighting experience and career progression.',
        category: 'Professional',
        image: '/templates/professional.png',
        isPremium: true,
    },
    {
        id: 'grid-folio',
        name: 'Grid Master',
        description: 'Masonry grid layout for showcasing a large volume of visual work.',
        category: 'Creative',
        image: '/templates/grid.png',
        isPremium: false,
    },
    {
        id: 'simple-cv',
        name: 'Digital CV',
        description: 'Single-page resume style for a quick and direct professional overview.',
        category: 'Minimal',
        image: '/templates/resume.png',
        isPremium: false,
    }
];
