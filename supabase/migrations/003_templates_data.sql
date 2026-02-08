-- Insert default templates
INSERT INTO public.templates (id, name, display_name, description, category, is_premium, config) VALUES
(uuid_generate_v4(), 'modern', 'Modern', 'Clean and contemporary design with bold typography', 'modern', false, '{"primaryColor": "#3B82F6", "secondaryColor": "#10B981", "fontFamily": "Inter", "layout": "single-page"}'),
(uuid_generate_v4(), 'minimal', 'Minimal', 'Minimalist design focusing on content', 'minimal', false, '{"primaryColor": "#000000", "secondaryColor": "#666666", "fontFamily": "System", "layout": "single-page"}'),
(uuid_generate_v4(), 'creative', 'Creative', 'Vibrant design with animations and gradients', 'creative', true, '{"primaryColor": "#8B5CF6", "secondaryColor": "#EC4899", "fontFamily": "Poppins", "layout": "multi-page"}'),
(uuid_generate_v4(), 'professional', 'Professional', 'Corporate-friendly design with subtle styling', 'professional', false, '{"primaryColor": "#1F2937", "secondaryColor": "#3B82F6", "fontFamily": "Georgia", "layout": "single-page"}'),
(uuid_generate_v4(), 'startup', 'Startup', 'Modern startup aesthetic with bold colors', 'startup', true, '{"primaryColor": "#F59E0B", "secondaryColor": "#EF4444", "fontFamily": "Space Mono", "layout": "multi-page"}');
