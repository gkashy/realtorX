// supabase/functions/listing-import-manager/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY'); // For real estate APIs
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Missing Authorization header', {
        status: 401
      });
    }
    const token1 = authHeader.replace('Bearer ', '');
    const { data: { user: user11111 }, error: authError } = await supabase.auth.getUser(token1);
    if (authError || !user11111) {
      return new Response('Invalid token', {
        status: 401
      });
    }
    // Get user context
    const { data: context, error: contextError } = await supabase.rpc('get_user_context', {
      user_auth_id: user11111.id
    });
    if (contextError || !context || context.length === 0) {
      return new Response('User context not found', {
        status: 403
      });
    }
    const userContext = context[0];
    let action, data;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // Handle file uploads
      const formData = await req.formData();
      const actionValue = formData.get('action');
      if (!actionValue || actionValue instanceof File) {
        throw new Error('action field is required and must be a string');
      }
      action = actionValue;
      const dataValue = formData.get('data');
      const dataString = dataValue && !(dataValue instanceof File) ? dataValue : '{}';
      data = JSON.parse(dataString);
      // Extract files from FormData
      data.files = [];
      for (const [key, value] of formData.entries()){
        if (value instanceof File) {
          data.files.push(value);
        }
      }
    } else {
      // Handle JSON requests (existing functionality)
      const requestBody = await req.json();
      action = requestBody.action;
      data = requestBody.data;
    }
    switch(action){
      case 'import_from_url':
        return await importFromUrl(supabase, userContext, data, token1, user11111.id);
      case 'enrich_address':
        return await enrichAddress(supabase, userContext, data, token1);
      case 'upload_photos':
        return await handleUserPhotoUpload(supabase, userContext, data, user11111.id);
      case 'upload_files':
        return await handleFileUpload(supabase, userContext, data, user11111.id);
      case 'import_from_mls':
        return await importFromMLS(supabase, userContext, data);
      case 'scrape_batch':
        return await scrapeBatch(supabase, userContext, data, token1, user11111.id);
      case 'enhance_existing':
        return await enhanceExistingListing(supabase, userContext, data, token1);
      case 'auto_import_setup':
        return await setupAutoImport(supabase, userContext, data);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in listing-import-manager:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
// 🔥 ADD THIS FUNCTION to your serverless code
function normalizePropertyType(apiPropertyType) {
  if (!apiPropertyType) return 'single_family'; // default
  const normalized = apiPropertyType.toLowerCase().replace(/[^a-z]/g, '');
  // Map common API values to your constraint values
  const propertyTypeMap = {
    'singlefamily': 'single_family',
    'single_family': 'single_family',
    'singlefamilyresidence': 'single_family',
    'house': 'single_family',
    'detached': 'single_family',
    'condo': 'condo',
    'condominium': 'condo',
    'apartment': 'condo',
    'townhouse': 'townhouse',
    'townhome': 'townhouse',
    'rowhouse': 'townhouse',
    'land': 'land',
    'lot': 'land',
    'vacant': 'land',
    'commercial': 'commercial',
    'office': 'commercial',
    'retail': 'commercial',
    'industrial': 'commercial'
  };
  return propertyTypeMap[normalized] || 'single_family';
}
// 🔥 UPDATE your getDataFromZillowAPI function
// Find this line:
// property_type: property.homeType || property.propertyType,
// Replace with:
// property_type: normalizePropertyType(property.homeType || property.propertyType),
async function importFromUrl(supabase, userContext, data, token1, userId) {
  const { listing_url, auto_generate_tour = true } = data;
  // Validate URL format
  if (!listing_url || typeof listing_url !== 'string') {
    throw new Error('listing_url is required and must be a string');
  }
  try {
    new URL(listing_url);
  } catch  {
    throw new Error('Invalid URL format provided');
  }
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required for web scraping', {
      status: 500
    });
  }
  try {
    // Step 1: Scrape the listing page
    console.log(`Scraping listing from: ${listing_url}`);
    const response = await fetch(listing_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch listing page: ${response.statusText}`);
    }
    const html = await response.text();
    // Step 2: Use AI to extract listing data
    const extractedData = await extractListingDataWithAI(html, listing_url);
    // Step 3: Enhance with additional data sources
    const enrichedData = await enrichListingData(extractedData);
    // Step 4: Create listing using existing listing-management function
    const listingResponse = await createEnhancedListing(supabase, userContext, enrichedData, token1);
    // Step 5: Import photos if found
    let photoImportResults = null;
    if (extractedData.photo_urls && extractedData.photo_urls.length > 0) {
      photoImportResults = await importPhotosFromUrls(supabase, listingResponse.data.id, extractedData.photo_urls, userId);
    }
    // Step 6: Auto-generate virtual tour if requested
    let tourRequest = null;
    if (auto_generate_tour && photoImportResults && photoImportResults.imported_count > 2) {
      tourRequest = await requestVirtualTour(supabase, listingResponse.data.id, token1);
    }
    // Step 7: Track import analytics
    await supabase.rpc('fn_track_event', {
      event_name: 'listing_imported_from_url',
      payload: {
        listing_id: listingResponse.data.id,
        source_url: listing_url,
        photos_imported: photoImportResults?.imported_count || 0,
        tour_requested: !!tourRequest
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        listing: listingResponse.data,
        extracted_data: extractedData,
        photo_import: photoImportResults,
        tour_request: tourRequest,
        source_url: listing_url
      },
      message: 'Listing imported successfully from URL'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('URL import error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}
async function handleFileUpload(supabase, userContext, data, userAuthId) {
  const { listing_id, files, primary_photo_index = 0 } = data;
  console.log(`📁 Starting direct file upload for listing ${listing_id}`);
  console.log(`📁 Received ${files?.length || 0} files`);
  // Validate inputs
  if (!listing_id) {
    throw new Error('listing_id is required');
  }
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error('files array is required and must not be empty');
  }
  if (files.length > 40) {
    throw new Error('Maximum 40 files allowed per listing');
  }
  // Verify listing exists and user has permission
  const { data: listing, error: listingError } = await supabase.from('listings').select('id, company_id').eq('id', listing_id).single();
  if (listingError || !listing) {
    throw new Error('Listing not found or access denied');
  }
  // Check if user has permission (same company)
  if (listing.company_id !== userContext.company_id) {
    throw new Error('Access denied: listing belongs to different company');
  }
  // Upload files directly
  const fileUploadResult = await uploadFilesDirectly(supabase, listing_id, files, userAuthId, primary_photo_index);
  console.log(`📁 Upload complete: ${fileUploadResult.imported_count}/${fileUploadResult.total_files} files uploaded`);
  return new Response(JSON.stringify({
    success: true,
    data: {
      listing_id: listing_id,
      ...fileUploadResult
    },
    message: `Successfully uploaded ${fileUploadResult.imported_count} of ${fileUploadResult.total_files} files`
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function uploadFilesDirectly(supabase, listingId, files, userAuthId, primaryPhotoIndex = 0) {
  const importResults = {
    total_files: files.length,
    imported_count: 0,
    failed_count: 0,
    imported_assets: [],
    errors: []
  };
  // Process up to 40 files
  const filesToProcess = files.slice(0, 40);
  console.log(`📁 Processing ${filesToProcess.length} files for listing ${listingId}`);
  // Validate files first
  const validFiles = [];
  for(let i = 0; i < filesToProcess.length; i++){
    const file = filesToProcess[i];
    // Validate file type
    if (!file.type.startsWith('image/')) {
      importResults.failed_count++;
      importResults.errors.push({
        filename: file.name,
        error: `Invalid file type: ${file.type}. Only images allowed.`
      });
      continue;
    }
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      importResults.failed_count++;
      importResults.errors.push({
        filename: file.name,
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max 10MB allowed.`
      });
      continue;
    }
    validFiles.push(file);
  }
  if (validFiles.length === 0) {
    return {
      total_files: files.length,
      imported_count: 0,
      failed_count: files.length,
      imported_assets: [],
      errors: importResults.errors
    };
  }
  // Process in batches of 5 to avoid overwhelming the server
  const BATCH_SIZE = 5;
  const batches = [];
  for(let i = 0; i < validFiles.length; i += BATCH_SIZE){
    batches.push(validFiles.slice(i, i + BATCH_SIZE));
  }
  console.log(`📦 Processing ${batches.length} batches of files`);
  let currentIndex = 0;
  for (const [batchIndex, batch] of batches.entries()){
    console.log(`📁 Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} files`);
    const batchPromises = batch.map(async (file, indexInBatch)=>{
      const globalIndex = currentIndex + indexInBatch;
      try {
        console.log(`📤 Uploading file ${globalIndex + 1}: ${file.name}`);
        // Generate unique filename
        const fileExtension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
        const uniqueFileName = `direct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        const storagePath = `${listingId}/${uniqueFileName}`;
        console.log(`📤 Uploading to storage: ${storagePath}`);
        // Upload to Supabase Storage - file is already a Blob!
        const { data: uploadData, error: uploadError } = await supabase.storage.from('media-assets').upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        if (uploadError) {
          console.error(`❌ Upload error for file ${globalIndex + 1}:`, uploadError);
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
        console.log(`✅ Storage upload successful for file ${globalIndex + 1}`);
        // Create media asset record
        const mediaAsset = {
          listing_id: listingId,
          user_id: userAuthId,
          asset_kind: 'image',
          storage_path: storagePath,
          upload_order: globalIndex + 1,
          is_primary: globalIndex === primaryPhotoIndex,
          metadata: {
            original_filename: file.name,
            uploaded_at: new Date().toISOString(),
            alt_text: `Uploaded file: ${file.name}`,
            upload_method: 'direct_file_upload',
            batch_index: batchIndex + 1,
            file_size: file.size,
            content_type: file.type
          }
        };
        const { data: assetData, error: assetError } = await supabase.from('media_assets').insert(mediaAsset).select().single();
        if (assetError) {
          console.error(`❌ Asset creation error for file ${globalIndex + 1}:`, assetError);
          // Cleanup: remove uploaded file if database insert fails
          await supabase.storage.from('media-assets').remove([
            storagePath
          ]);
          throw new Error(`Database insert failed: ${assetError.message}`);
        }
        console.log(`✅ Database record created for file ${globalIndex + 1}`);
        return {
          success: true,
          asset: assetData,
          index: globalIndex,
          filename: file.name
        };
      } catch (error) {
        console.error(`❌ Failed to upload file ${globalIndex + 1} (${file.name}):`, error);
        return {
          success: false,
          error: error.message,
          filename: file.name,
          index: globalIndex
        };
      }
    });
    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    // Process batch results
    for (const result of batchResults){
      if (result.success) {
        importResults.imported_count++;
        importResults.imported_assets.push(result.asset);
      } else {
        importResults.failed_count++;
        importResults.errors.push({
          filename: result.filename,
          error: result.error
        });
      }
    }
    currentIndex += batch.length;
    // Small delay between batches to prevent overwhelming the server
    if (batchIndex < batches.length - 1) {
      await new Promise((resolve)=>setTimeout(resolve, 500));
    }
  }
  console.log(`📁 Direct file import complete: ${importResults.imported_count}/${importResults.total_files} files imported successfully`);
  return importResults;
}
async function extractListingDataWithAI(html, sourceUrl) {
  // Clean HTML and extract meaningful content
  // Limit HTML size before processing to avoid memory issues
  const limitedHtml = html.substring(0, 100000); // 100KB limit
  const cleanContent = limitedHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 8000); // Limit content for AI processing
  const prompt = `Extract real estate listing information from this webpage content. 
  
Source URL: ${sourceUrl}
Content: ${cleanContent}

Extract and return JSON in this exact format:
{
  "title": "extracted property title",
  "address": "full address including city, state, zip",
  "price": number,
  "beds": number,
  "baths": number,
  "sqft": number,
  "description": "property description",
  "property_type": "single_family|condo|townhouse|land|commercial",
  "listing_type": "sale|rent",
  "features": ["feature1", "feature2"],
  "photo_urls": ["url1", "url2"],
  "agent_info": {
    "name": "agent name",
    "phone": "phone number",
    "email": "email"
  },
  "additional_details": {
    "year_built": number,
    "lot_size": "lot size",
    "hoa_fee": number,
    "property_tax": number
  },
  "confidence_score": 0.95
}`;
  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate data extraction expert. Extract accurate listing information from webpage content. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });
    // 🔍 ADD DETAILED LOGGING
    // 🔍 ADD DETAILED LOGGING
    console.log('OpenAI API Response Status:', aiResponse.status);
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API failed: ${aiResponse.status} - ${errorText}`);
    }
    const aiResult = await aiResponse.json();
    console.log('OpenAI API Result:', JSON.stringify(aiResult, null, 2));
    // 🔥 FIX: Clean markdown code blocks before parsing
    let content = aiResult.choices[0].message.content;
    console.log('Raw content from GPT-4:', content);
    // Remove markdown code blocks that GPT-4 sometimes adds
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('Cleaned content for parsing:', content);
    let extractedData;
    try {
      extractedData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Content that failed to parse:', content.substring(0, 500));
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }
    // Validate required fields
    if (!extractedData || typeof extractedData !== 'object') {
      throw new Error('AI returned invalid data structure');
    }
    // Add metadata
    extractedData.source_url = sourceUrl;
    extractedData.extracted_at = new Date().toISOString();
    extractedData.extraction_method = 'ai_gpt4';
    return extractedData;
  } catch (error) {
    console.error('AI extraction error:', error);
    console.error('Error stack:', error.stack);
    throw new Error('Failed to extract listing data with AI');
  }
}
// 🔥 NEW: Missing function that was called in importFromUrl
async function enrichListingData(extractedData) {
  // Enhance the AI-extracted data with API calls
  if (extractedData.address) {
    const propertyData = await getPropertyDataFromAPIs(extractedData.address);
    if (propertyData) {
      // Fill in missing data from API
      extractedData.beds = extractedData.beds || propertyData.bedrooms;
      extractedData.baths = extractedData.baths || propertyData.bathrooms;
      extractedData.sqft = extractedData.sqft || propertyData.square_feet;
      extractedData.price = extractedData.price || propertyData.estimated_value;
      extractedData.zestimate = propertyData.zestimate;
      extractedData.api_source = propertyData.source;
    }
  }
  return {
    ...extractedData,
    enriched_at: new Date().toISOString()
  };
}
async function handleUserPhotoUpload(supabase, userContext, data, userAuthId) {
  const { listing_id, photo_urls, primary_photo_index = 0 } = data;
  console.log(`📸 Starting upload of ${photo_urls?.length || 0} photos for listing ${listing_id}`);
  // Validate inputs
  if (!listing_id) {
    throw new Error('listing_id is required');
  }
  if (!photo_urls || !Array.isArray(photo_urls) || photo_urls.length === 0) {
    throw new Error('photo_urls array is required and must not be empty');
  }
  if (photo_urls.length > 40) {
    throw new Error('Maximum 40 photos allowed per listing');
  }
  // Verify listing exists and user has permission
  const { data: listing, error: listingError } = await supabase.from('listings').select('id, company_id').eq('id', listing_id).single();
  if (listingError || !listing) {
    throw new Error('Listing not found or access denied');
  }
  // Check if user has permission (same company)
  if (listing.company_id !== userContext.company_id) {
    throw new Error('Access denied: listing belongs to different company');
  }
  // Use your existing importPhotosFromUrls function but with user tracking
  const photoImportResult = await importPhotosFromUrls(supabase, listing_id, photo_urls, userAuthId, primary_photo_index);
  console.log(`📸 Upload complete: ${photoImportResult.imported_count}/${photoImportResult.total_urls} photos uploaded`);
  return new Response(JSON.stringify({
    success: true,
    data: {
      listing_id: listing_id,
      ...photoImportResult
    },
    message: `Successfully uploaded ${photoImportResult.imported_count} of ${photoImportResult.total_urls} photos`
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function enrichAddress(supabase, userContext, data, token1) {
  const { address, create_listing = false } = data;
  console.log('🔍 UserContext structure:', JSON.stringify(userContext, null, 2));
  try {
    // 🔥 STEP 1: Try Zillow API first (best property data when available)
    const propertyData = await getPropertyDataFromAPIs(address);
    if (propertyData && propertyData.address) {
      // ✅ ZILLOW SUCCESS - Use Zillow data for validation + enrichment
      const enrichedData = {
        original_address: address,
        formatted_address: propertyData.address,
        coordinates: {
          lat: propertyData.latitude,
          lng: propertyData.longitude
        },
        address_components: null,
        property_data: propertyData,
        google_place_id: null,
        zillow_data: propertyData.source === 'zillow_api' ? {
          zestimate: propertyData.zestimate,
          rent_zestimate: propertyData.rent_zestimate,
          listing_url: propertyData.listing_url,
          photos: propertyData.photos,
          status: propertyData.status
        } : null,
        validation_source: 'zillow_api',
        enriched_at: new Date().toISOString()
      };
      // Step 2: Create listing if requested
      let listing = null;
      if (create_listing && propertyData) {
        listing = await createEnhancedListing(supabase, userContext, {
          title: `${propertyData.bedrooms || 0}BR/${propertyData.bathrooms || 0}BA - ${propertyData.address}`,
          address: propertyData.address,
          price: propertyData.estimated_value || propertyData.zestimate || 0,
          beds: propertyData.bedrooms || 0,
          baths: propertyData.bathrooms || 0,
          sqft: propertyData.square_feet || 0,
          description: propertyData.description || `Property enriched from address lookup: ${address}`,
          property_type: normalizePropertyType(propertyData.property_type) || 'single_family',
          listing_type: 'sale',
          enriched_data: enrichedData
        }, token1);
        // 🔥 Import photos if found from Zillow API
        if (listing?.data?.id && propertyData.photos && propertyData.photos.length > 0) {
          console.log(`📸 Importing ${propertyData.photos.length} photos from Zillow API`);
          try {
            const photoImportResults = await importPhotosFromUrls(supabase, listing.data.id, propertyData.photos, userContext.id);
            console.log(`✅ Photo import completed: ${photoImportResults.imported_count}/${photoImportResults.total_urls} photos imported`);
            listing.data.photo_import = photoImportResults;
          } catch (photoError) {
            console.error('❌ Photo import failed:', photoError);
            listing.data.photo_import = {
              error: photoError.message,
              imported_count: 0
            };
          }
        }
      }
      return new Response(JSON.stringify({
        success: true,
        data: {
          enriched_address: enrichedData,
          listing: listing?.data || null
        },
        message: 'Address enriched successfully with Zillow data'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 📍 STEP 2: Fallback to Google Places (Zillow had no data)
    if (!GOOGLE_PLACES_API_KEY) {
      return new Response('Google Places API key required for address enrichment when property data not available', {
        status: 500
      });
    }
    // Get place details from Google Places API
    const placeResponse = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` + `input=${encodeURIComponent(address)}&inputtype=textquery&fields=place_id,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`);
    const placeData = await placeResponse.json();
    if (!placeData.candidates || placeData.candidates.length === 0) {
      throw new Error('Address not found in Google Places and no property data available');
    }
    const place = placeData.candidates[0];
    // Get detailed place information
    const detailsResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?` + `place_id=${place.place_id}&fields=formatted_address,address_components,geometry,photos&key=${GOOGLE_PLACES_API_KEY}`);
    const detailsData = await detailsResponse.json();
    // Create enriched data with Google Places validation (no property data)
    const enrichedData = {
      original_address: address,
      formatted_address: detailsData.result.formatted_address,
      coordinates: detailsData.result.geometry.location,
      address_components: detailsData.result.address_components,
      property_data: null,
      google_place_id: place.place_id,
      zillow_data: null,
      validation_source: 'google_places',
      enriched_at: new Date().toISOString()
    };
    // Step 3: Create listing if requested (basic listing without property data)
    let listing = null;
    if (create_listing) {
      listing = await createEnhancedListing(supabase, userContext, {
        title: `Property at ${detailsData.result.formatted_address}`,
        address: detailsData.result.formatted_address,
        price: 0,
        beds: 0,
        baths: 0,
        sqft: 0,
        description: `Address validated via Google Places: ${address}`,
        property_type: 'single_family',
        listing_type: 'sale',
        enriched_data: enrichedData
      }, token1);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        enriched_address: enrichedData,
        listing: listing?.data || null
      },
      message: 'Address validated with Google Places (no property data available)'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Address enrichment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}
// 🔥 UPDATED - Now includes Zillow API as primary source
async function getPropertyDataFromAPIs(address) {
  // 🔥 NEW WATERFALL: Zillow API first, then fallbacks
  const sources = [
    ()=>getDataFromZillowAPI(address),
    ()=>getDataFromRentSpree(address),
    ()=>getDataFromRealtyMole(address),
    ()=>getDataFromAttom(address) // Fallback 3
  ];
  for (const getDataFunc of sources){
    try {
      const data = await getDataFunc();
      if (data && (data.bedrooms || data.estimated_value)) {
        console.log(`✅ Property data found from: ${data.source}`);
        return data;
      }
    } catch (error) {
      console.log(`❌ Property API failed, trying next source:`, error.message);
    }
  }
  return null;
}
// 🔥 NEW - Zillow API integration (PRIMARY SOURCE)
// 🔥 CORRECTED - Zillow API integration (PRIMARY SOURCE)
async function getDataFromZillowAPI(address) {
  if (!RAPID_API_KEY) return null;
  console.log('🏠 Calling Zillow API for:', address);
  try {
    const response = await fetch(`https://real-time-zillow-data.p.rapidapi.com/property-details-address?address=${encodeURIComponent(address)}`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'real-time-zillow-data.p.rapidapi.com'
      }
    });
    if (!response.ok) throw new Error('Zillow API failed');
    const result = await response.json();
    console.log('🔍 Zillow API Response Status:', result.status);
    if (result.status === 'OK' && result.data) {
      const property = result.data;
      // 🔥 FIX: Build photos array from individual photo fields
      const photos = [];
      // Add high-res image if available
      if (property.hiResImageLink) {
        photos.push(property.hiResImageLink);
      }
      // Add medium image if available and different from high-res
      if (property.mediumImageLink && property.mediumImageLink !== property.hiResImageLink) {
        photos.push(property.mediumImageLink);
      }
      // 🔍 DEBUG: Log photo information
      console.log('📸 Photo count from API:', property.photoCount);
      console.log('📸 High-res image:', property.hiResImageLink);
      console.log('📸 Medium image:', property.mediumImageLink);
      console.log('📸 Photos array built:', photos);
      console.log('📸 Virtual tour URL:', property.virtualTourUrl);
      const formattedAddress = property.address ? `${property.address.streetAddress || property.streetAddress || ''}, ${property.address.city || property.city || ''}, ${property.address.state || property.state || ''} ${property.address.zipcode || property.zipcode || ''}`.trim() : `${property.streetAddress || ''}, ${property.city || ''}, ${property.state || ''} ${property.zipcode || ''}`.trim();
      return {
        bedrooms: property.bedrooms || property.beds,
        bathrooms: property.bathrooms || property.baths,
        square_feet: property.livingArea || property.sqft,
        estimated_value: property.price || property.zestimate,
        property_type: normalizePropertyType(property.homeType || property.propertyType),
        year_built: property.yearBuilt,
        lot_size: property.lotSize,
        address: formattedAddress,
        city: property.address?.city || property.city,
        state: property.address?.state || property.state,
        zipcode: property.address?.zipcode || property.zipcode,
        latitude: property.latitude,
        longitude: property.longitude,
        description: property.description,
        zestimate: property.zestimate,
        rent_zestimate: property.rentZestimate,
        // 🔥 FIXED: Use the photos array we built
        photos: photos,
        photo_count: property.photoCount || 0,
        listing_url: property.hdpUrl || property.url,
        status: property.homeStatus,
        // 🔥 BONUS: Add virtual tour info
        virtual_tour: property.virtualTourUrl || property.thirdPartyVirtualTour?.lightboxUrl || property.thirdPartyVirtualTour?.externalUrl,
        source: 'zillow_api'
      };
    }
    return null;
  } catch (error) {
    console.log('❌ Zillow API failed:', error.message);
    return null;
  }
}
async function getDataFromRentSpree(address) {
  if (!RAPID_API_KEY) return null;
  const response = await fetch(`https://rentspree-com.p.rapidapi.com/properties/auto-complete?location=${encodeURIComponent(address)}`, {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'rentspree-com.p.rapidapi.com'
    }
  });
  if (!response.ok) throw new Error('RentSpree API failed');
  const data = await response.json();
  if (data && data.length > 0) {
    const property = data[0];
    return {
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.sqft,
      estimated_value: property.price,
      property_type: property.propertyType,
      year_built: property.yearBuilt,
      source: 'rentspree'
    };
  }
  return null;
}
async function getDataFromRealtyMole(address) {
  if (!RAPID_API_KEY) return null;
  const response = await fetch(`https://realty-mole-property-api.p.rapidapi.com/properties?address=${encodeURIComponent(address)}`, {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
    }
  });
  if (!response.ok) throw new Error('RealtyMole API failed');
  const data = await response.json();
  if (data && data.bedrooms) {
    return {
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      square_feet: data.squareFootage,
      estimated_value: data.estimatedValue,
      property_type: data.propertyType,
      year_built: data.yearBuilt,
      lot_size: data.lotSize,
      source: 'realty_mole'
    };
  }
  return null;
}
async function getDataFromAttom(address) {
  // Placeholder for Attom Data API integration
  // Would require Attom API key and specific implementation
  return null;
}
// 🔥 NEW - Missing function that was called in switch statement
async function importFromMLS(supabase, userContext, data) {
  return new Response(JSON.stringify({
    success: false,
    message: 'MLS import feature coming soon',
    data: null
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function createEnhancedListing(supabase, userContext, listingData, token1) {
  console.log('=== CREATE ENHANCED LISTING DEBUG ===');
  console.log('Raw input data:', JSON.stringify(listingData, null, 2));
  // 🔥 FIX: Map data to exact table columns
  const cleanedData = {
    // Required fields
    title: listingData.title || 'Imported Property',
    address: listingData.address || 'Address Not Available',
    // Numeric fields (handle type conversion)
    price: listingData.price ? Number(listingData.price) : null,
    beds: listingData.beds ? Number(listingData.beds) : null,
    baths: listingData.baths ? Number(listingData.baths) : null,
    sqft: listingData.sqft ? Number(listingData.sqft) : null,
    // Optional text fields
    description: listingData.description || null,
    property_type: normalizePropertyType(listingData.property_type) || 'single_family',
    listing_type: listingData.listing_type || 'sale',
    // Import tracking fields
    source_url: listingData.source_url || null,
    // Store ALL extra data in enriched_data JSONB column
    enriched_data: {
      // Keep any existing enriched_data
      ...listingData.enriched_data || {},
      // Add AI extraction data
      additional_details: listingData.additional_details,
      features: listingData.features,
      photo_urls: listingData.photo_urls,
      agent_info: listingData.agent_info,
      confidence_score: listingData.confidence_score,
      extracted_at: listingData.extracted_at,
      extraction_method: listingData.extraction_method,
      // Add API enrichment data
      api_source: listingData.api_source,
      zestimate: listingData.zestimate,
      enriched_at: listingData.enriched_at,
      // Store original extracted data for reference
      original_extraction: {
        title: listingData.title,
        price: listingData.price,
        beds: listingData.beds,
        baths: listingData.baths,
        sqft: listingData.sqft
      }
    }
  };
  console.log('Cleaned data for listing creation:', JSON.stringify(cleanedData, null, 2));
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/listing-management`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token1}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'create',
      data: {
        ...cleanedData,
        imported: true,
        import_source: listingData.source_url || 'address_enrichment'
      }
    })
  });
  console.log('Response status:', response.status);
  const responseText = await response.text();
  console.log('Response body:', responseText);
  if (!response.ok) {
    throw new Error(`Failed to create enhanced listing: ${response.status} - ${responseText}`);
  }
  return JSON.parse(responseText);
}
// 🔥 UPDATED: Replace your existing importPhotosFromUrls function with this
async function importPhotosFromUrls(supabase, listingId, photoUrls, userAuthId = null, primaryPhotoIndex = 0) {
  const importResults = {
    total_urls: photoUrls.length,
    imported_count: 0,
    failed_count: 0,
    imported_assets: []
  };
  // Process up to 40 photos (increased from 10)
  const photosToProcess = photoUrls.slice(0, 40);
  console.log(`📸 Processing ${photosToProcess.length} photos for listing ${listingId}`);
  // Process in batches of 5 to avoid overwhelming the server
  const BATCH_SIZE = 5;
  const batches = [];
  for(let i = 0; i < photosToProcess.length; i += BATCH_SIZE){
    batches.push(photosToProcess.slice(i, i + BATCH_SIZE));
  }
  console.log(`📦 Processing ${batches.length} batches of photos`);
  let currentIndex = 0;
  for (const [batchIndex, batch] of batches.entries()){
    console.log(`📸 Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} photos`);
    const batchPromises = batch.map(async (photoUrl, indexInBatch)=>{
      const globalIndex = currentIndex + indexInBatch;
      try {
        console.log(`📥 Downloading photo ${globalIndex + 1}: ${photoUrl}`);
        // Download image
        const imageResponse = await fetch(photoUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: HTTP ${imageResponse.status}`);
        }
        const imageBlob = await imageResponse.blob();
        // Validate it's actually an image
        if (!imageBlob.type.startsWith('image/')) {
          throw new Error(`Invalid image type: ${imageBlob.type}`);
        }
        // Generate unique filename
        const urlParts = photoUrl.split('?')[0]; // Remove query params first
        const fileExtension = urlParts.includes('.') ? urlParts.split('.').pop() : 'jpg';
        const fileName = `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
        const storagePath = `${listingId}/${fileName}`;
        console.log(`📤 Uploading to storage: ${storagePath}`);
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from('media-assets').upload(storagePath, imageBlob, {
          cacheControl: '3600',
          upsert: false
        });
        if (uploadError) {
          console.error(`❌ Upload error for photo ${globalIndex + 1}:`, uploadError);
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
        console.log(`✅ Storage upload successful for photo ${globalIndex + 1}`);
        // Create media asset record
        const mediaAsset = {
          listing_id: listingId,
          user_id: userAuthId,
          asset_kind: 'image',
          storage_path: storagePath,
          upload_order: globalIndex + 1,
          is_primary: globalIndex === primaryPhotoIndex,
          metadata: {
            source_url: photoUrl,
            imported_at: new Date().toISOString(),
            alt_text: `Imported from ${photoUrl}`,
            upload_method: userAuthId ? 'user_upload' : 'address_enrichment',
            batch_index: batchIndex + 1,
            file_size: imageBlob.size,
            content_type: imageBlob.type
          }
        };
        const { data: assetData, error: assetError } = await supabase.from('media_assets').insert(mediaAsset).select().single();
        if (assetError) {
          console.error(`❌ Asset creation error for photo ${globalIndex + 1}:`, assetError);
          // Cleanup: remove uploaded file if database insert fails
          await supabase.storage.from('media-assets').remove([
            storagePath
          ]);
          throw new Error(`Database insert failed: ${assetError.message}`);
        }
        console.log(`✅ Database record created for photo ${globalIndex + 1}`);
        return {
          success: true,
          asset: assetData,
          index: globalIndex
        };
      } catch (error) {
        console.error(`❌ Failed to import photo ${globalIndex + 1} (${photoUrl}):`, error);
        return {
          success: false,
          error: error.message,
          url: photoUrl,
          index: globalIndex
        };
      }
    });
    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    // Process batch results
    for (const result of batchResults){
      if (result.success) {
        importResults.imported_count++;
        importResults.imported_assets.push(result.asset);
      } else {
        importResults.failed_count++;
      }
    }
    currentIndex += batch.length;
    // Small delay between batches to prevent overwhelming the server
    if (batchIndex < batches.length - 1) {
      await new Promise((resolve)=>setTimeout(resolve, 500));
    }
  }
  console.log(`📸 Import complete: ${importResults.imported_count}/${importResults.total_urls} photos imported successfully`);
  return importResults;
}
async function requestVirtualTour(supabase, listingId, token1) {
  // Use existing tour-generator function internally
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/tour-generator`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token1}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'request_tour',
      data: {
        listing_id: listingId,
        tour_type: 'photo_to_video',
        preferences: {
          duration: 60,
          music: 'ambient',
          transition_style: 'smooth',
          auto_generated: true
        }
      }
    })
  });
  if (!response.ok) {
    throw new Error('Failed to request virtual tour');
  }
  return response.json();
}
async function scrapeBatch(supabase, userContext, data, token1, userId) {
  const { listing_urls, auto_generate_tours = true } = data;
  const results = {
    total_urls: listing_urls.length,
    successful_imports: 0,
    failed_imports: 0,
    imported_listings: [],
    errors: []
  };
  for (const url of listing_urls){
    try {
      const importResult = await importFromUrl(supabase, userContext, {
        listing_url: url,
        auto_generate_tour: auto_generate_tours
      }, token1, userId);
      if (importResult.ok) {
        const data = await importResult.json();
        if (data.success) {
          results.successful_imports++;
          results.imported_listings.push(data.data);
        } else {
          results.failed_imports++;
          results.errors.push({
            url,
            error: data.error
          });
        }
      } else {
        results.failed_imports++;
        results.errors.push({
          url,
          error: 'HTTP error'
        });
      }
      // Small delay between requests to be respectful
      await new Promise((resolve)=>setTimeout(resolve, 2000));
    } catch (error) {
      results.failed_imports++;
      results.errors.push({
        url,
        error: error.message
      });
    }
  }
  return new Response(JSON.stringify({
    success: true,
    data: results,
    message: `Batch import completed: ${results.successful_imports} successful, ${results.failed_imports} failed`
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function enhanceExistingListing(supabase, userContext, data, token1) {
  const { listing_id } = data;
  // Get existing listing
  const { data: listing, error: listingError } = await supabase.from('listings').select('*').eq('id', listing_id).single();
  if (listingError || !listing) {
    return new Response('Listing not found', {
      status: 404
    });
  }
  // Enhance with address enrichment
  const enrichmentResult = await enrichAddress(supabase, userContext, {
    address: listing.address,
    create_listing: false
  }, token1);
  const enrichmentData = await enrichmentResult.json();
  if (enrichmentData.success) {
    // Update existing listing with enriched data
    const updateData = {
      enriched_data: enrichmentData.data.enriched_address,
      updated_at: new Date().toISOString()
    };
    // Add property data if available
    if (enrichmentData.data.enriched_address.property_data) {
      const propertyData = enrichmentData.data.enriched_address.property_data;
      if (!listing.beds && propertyData.bedrooms) {
        updateData.beds = propertyData.bedrooms;
      }
      if (!listing.baths && propertyData.bathrooms) {
        updateData.baths = propertyData.bathrooms;
      }
      if (!listing.sqft && propertyData.square_feet) {
        updateData.sqft = propertyData.square_feet;
      }
    }
    const { data: updatedListing, error: updateError } = await supabase.from('listings').update(updateData).eq('id', listing_id).select().single();
    if (updateError) {
      throw updateError;
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        original_listing: listing,
        updated_listing: updatedListing,
        enrichment_data: enrichmentData.data.enriched_address
      },
      message: 'Listing enhanced successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  return enrichmentResult;
}
async function setupAutoImport(supabase, userContext, data) {
  const { import_sources, schedule, filters } = data;
  // Store auto-import configuration
  const { data: configData, error: configError } = await supabase.from('import_configurations').insert({
    company_id: userContext.company_id,
    import_sources: import_sources,
    schedule: schedule,
    filters: filters,
    is_active: true,
    created_at: new Date().toISOString()
  }).select().single();
  if (configError) {
    throw configError;
  }
  return new Response(JSON.stringify({
    success: true,
    data: configData,
    message: 'Auto-import configuration saved successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
