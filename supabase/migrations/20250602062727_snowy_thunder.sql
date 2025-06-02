-- Create hero_slides table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    cta_link TEXT NOT NULL,
    accent TEXT NOT NULL,
    position INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.hero_slides (title, subtitle, description, image_url, cta_text, cta_link, accent, position, is_active)
VALUES 
('Summer Collection 2025', 'Elevate Your Style', 'Discover our premium selection of summer essentials', 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Shop Now', '/new-arrivals', 'primary', 0, true),
('Bridal Boutique', 'Your Perfect Day', 'Everything you need for your special occasion', 'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Explore Collection', '/bridal-boutique', 'secondary', 1, true),
('Festive Collection', 'Celebrate in Style', 'Discover perfect gifts and festive fashion', 'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Shop Collection', '/festive-store', 'accent', 2, true);