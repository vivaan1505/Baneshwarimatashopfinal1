// Script to fetch and update brand website links in the database
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

async function updateBrandLinks() {
  try {
    console.log('Starting brand links update process...');
    
    // Fetch all brands
    const { data: brands, error: fetchError } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (fetchError) throw fetchError;
    console.log(`Found ${brands.length} brands to process`);
    
    // Process each brand
    for (const brand of brands) {
      // Skip brands that already have a website
      if (brand.website) {
        console.log(`Brand ${brand.name} already has website: ${brand.website}`);
        continue;
      }
      
      // Generate a likely website URL based on the brand name
      const websiteDomain = generateWebsiteDomain(brand.name);
      const websiteUrl = `https://${websiteDomain}`;
      
      console.log(`Updating ${brand.name} with website: ${websiteUrl}`);
      
      // Update the brand record
      const { error: updateError } = await supabase
        .from('brands')
        .update({ website: websiteUrl })
        .eq('id', brand.id);
      
      if (updateError) {
        console.error(`Error updating ${brand.name}:`, updateError);
        continue;
      }
      
      // Update any coupons for this brand that don't have a brand_link
      const { error: couponUpdateError } = await supabase
        .from('coupons')
        .update({ brand_link: websiteUrl })
        .eq('brand_id', brand.id)
        .is('brand_link', null);
      
      if (couponUpdateError) {
        console.error(`Error updating coupons for ${brand.name}:`, couponUpdateError);
      }
    }
    
    console.log('Brand links update completed successfully');
    return { success: true, message: 'Brand links updated successfully' };
  } catch (error) {
    console.error('Error updating brand links:', error);
    return { success: false, message: 'Failed to update brand links', error };
  }
}

// Helper function to generate a likely website domain from a brand name
function generateWebsiteDomain(brandName) {
  // Remove special characters and spaces, convert to lowercase
  const cleanName = brandName
    .toLowerCase()
    .replace(/[&']/g, '')
    .replace(/\s+/g, '');
  
  // Handle special cases
  if (cleanName.includes('l\'oréal') || cleanName.includes('loreal')) {
    return 'loreal.com';
  }
  
  return `${cleanName}.com`;
}

export { updateBrandLinks };