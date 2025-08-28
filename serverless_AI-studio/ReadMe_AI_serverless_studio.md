# Real Estate AI Studio - System Architecture & Workflows

## System Overview

Your platform is a comprehensive real estate AI studio with 12 serverless functions managing everything from multi-tenant company operations to sophisticated AI content generation. The system follows a multi-layered architecture with clear separation between user management, property operations, brand management, and AI processing.

## Core Architecture Patterns

### Multi-Tenant Design
- **Company-centric**: Every major entity belongs to a company
- **Role-based access**: Owner → Admin → Agent → Viewer hierarchy
- **Invitation system**: Token-based company joining
- **User context**: Single RPC call gets user's company_id, role, permissions

### Authentication Flow
```
1. User authenticates via Supabase Auth
2. All functions call get_user_context(user_auth_id)
3. Returns: { user_id, company_id, role, first_name, last_name, company_name }
4. Used for authorization and data filtering
```

## Function-by-Function Workflows

### 1. Company Management (`company-management`)
**Purpose**: Multi-tenant company operations

**Key Workflows**:
- **Company Creation**: Creates company + makes user owner + sets as default
- **User Invitations**: Generates secure tokens with expiration
- **Company Joining**: Validates tokens + adds to company_memberships
- **Context Retrieval**: Primary function called by all other services

**Frontend Integration**:
- Company selector dropdown
- Invitation management UI
- Role-based feature enabling/disabling
- User onboarding flows

### 2. Listing Management (`listing-management`)
**Purpose**: Core property CRUD operations

**Key Workflows**:
- **Create/Update**: Full property details with validation
- **Status Management**: Draft → Active → Pending → Sold → Archived
- **Permission Checking**: Agent+ can create, all can read company listings
- **Media Association**: Links to media_assets table

**Database Relationships**:
- `listings` → `companies` (company_id)
- `listings` → `media_assets` (one-to-many)
- `listings` → `virtual_tours` (one-to-many)

**Frontend Considerations**:
- Listing grid/table views filtered by company
- Status-based workflow UI
- Media gallery integration
- Role-based create/edit permissions

### 3. Media Upload (`media-upload`)
**Purpose**: Secure file handling with Supabase Storage

**Key Workflows**:
- **Presigned URLs**: Generate secure upload URLs
- **Confirmation**: Create database records after upload
- **Organization**: Files stored in `{listing_id}/` folders
- **Metadata Tracking**: File sizes, types, original names

**Storage Strategy**:
- Bucket: `media-assets`
- Path structure: `{listing_id}/{unique_filename}`
- Asset kinds: image, video, audio, document, ai_*

**Frontend Integration**:
- Drag-and-drop upload components
- Progress tracking
- Preview galleries
- Asset management interfaces

### 4. Brand Kit Manager (`brand-kit-manager`)
**Purpose**: Brand identity management system

**Key Workflows**:
- **Brand Kit Creation**: Colors, typography, voice, assets
- **Default Management**: Only one default per company
- **Asset Upload**: Logos, fonts, brand elements
- **Theme Management**: JSONB storage for flexible schemas

**Permission Model**:
- Only owners/admins can create/modify brand kits
- All roles can view for content generation

**Frontend Patterns**:
- Brand kit selector in content generation flows
- Visual theme preview
- Asset library management
- Color picker and typography controls

### 5. AI Brand Kit Manager (`ai-brand-kit-manager`)
**Purpose**: AI-powered brand creation and analysis

**Key Workflows**:
- **From Description**: Company details → GPT-4 → Complete brand kit
- **Logo Analysis**: GPT-4 Vision analyzes uploaded logos
- **Website Extraction**: Scrapes + analyzes existing websites
- **Brand Variations**: Generates seasonal/contextual variants

**AI Integration Points**:
- OpenAI GPT-4 for strategy
- GPT-4 Vision for logo analysis
- Web scraping for competitive analysis

**Frontend Considerations**:
- Multi-step brand creation wizard
- Logo upload with analysis preview
- Website URL input with validation
- AI-generated recommendations display

### 6. Listing Import Manager (`listing-import-manager`)
**Purpose**: Multi-source property data import and enrichment

**Key Workflows**:
- **URL Import**: AI web scraping → Property extraction → Media import
- **Address Enrichment**: Zillow API → Google Places fallback
- **Photo Management**: Bulk photo import (up to 40 per listing)
- **API Integration**: Multiple real estate APIs with fallbacks

**Data Sources**:
1. **Primary**: Zillow API (via RapidAPI)
2. **Secondary**: RentSpree, RealtyMole
3. **Fallback**: Google Places for address validation
4. **AI**: GPT-4 for web content extraction

**Frontend Workflows**:
- URL input with validation
- Address lookup with autocomplete
- Import progress tracking
- Photo batch upload interface
- Data verification screens

### 7. AI Realtime (`ai-realtime`)
**Purpose**: Real-time AI content generation hub

**18 Actions Available**:
- **Core Generation**: Hero images, business cards, social posts, flyers, copy
- **Design Library**: Styled content with 100+ templates
- **Reference-Based**: Upload inspiration images
- **Admin Tools**: Template creation, analytics, A/B testing

**AI Providers**:
- **GPT-4**: Analysis, prompt enhancement
- **GPT-Image-1**: Image generation
- **Combined**: Reference analysis → Image generation

**Frontend Architecture**:
- Real-time generation interface
- Template browser with filtering
- Reference image upload
- Progress tracking with live updates
- Download and preview systems

### 8. AI Staging (`ai-staging`)
**Purpose**: Virtual staging for empty properties

**Three Quality Tiers**:
1. **Basic**: OpenAI GPT-4 Vision + GPT-Image-1
2. **Advanced**: Meta SAM segmentation + Precision inpainting
3. **Pixel-Perfect**: Premium quality with refinement loops

**Workflow**:
- Room analysis (GPT-4 Vision)
- Mask generation (SAM or bounding box)
- Furniture placement (inpainting)
- Quality review and refinement

**Frontend Integration**:
- Photo selection from listing gallery
- Room type and style selectors
- Before/after comparison views
- Quality tier selection

### 9. AI Video (`ai-video`)
**Purpose**: Property video and tour generation

**Key Workflows**:
- **Scene Planning**: GPT-4 analyzes photos → Creates video pairs
- **Video Tours**: Sequential processing of video pairs
- **Property Videos**: Slideshow and cinematic styles
- **Provider Routing**: Pixverse, Runway, Veo3 based on requirements

**Processing Model**:
- **Sequential**: Video pairs processed in order
- **Queued**: Jobs sent to external Railway worker
- **Webhook**: Completion callbacks update database

**Frontend Considerations**:
- Photo upload and ordering interface
- Video style selection
- Processing queue visualization
- Final video preview and download

### 10. AI Webhooks (`ai-webhooks`)
**Purpose**: Handle callbacks from external AI providers

**Supported Providers**:
- **Pixverse**: Primary video generation
- **Runway**: Alternative video provider
- **Veo3**: Ultra-cinematic content
- **Replicate**: Model hosting
- **ElevenLabs**: Voice generation (planned)

**Sequential Processing Logic**:
- Video pairs complete in order
- Next job auto-queued when previous finishes
- Master job assembled when all pairs complete

**Frontend Integration**:
- Real-time job status updates
- Progress tracking across video pairs
- Error handling and retry mechanisms

### 11. AI Batch (`ai-batch`)
**Purpose**: Bulk processing for multiple listings

**Batch Types**:
- **Content Generation**: Multiple content types across listings
- **Virtual Staging**: Bulk room staging
- **Parent-Child Jobs**: Batch job → Individual jobs

**Scaling Considerations**:
- Maximum 50 listings per batch
- Priority queue management
- Progress tracking across jobs
- Cost estimation and limits

**Frontend Patterns**:
- Multi-select listing interfaces
- Content type checkboxes
- Batch progress dashboards
- Cost calculators

## Database Relationships & Data Flow

### Core Entity Relationships
```
companies (1) → (*) users (company_memberships)
companies (1) → (*) listings
companies (1) → (*) brand_kits
listings (1) → (*) media_assets
listings (1) → (*) ai_generation_jobs
brand_kits (1) → (*) brand_assets
users (1) → (*) ai_generation_jobs
```

### Multi-Tenancy Implementation
- **Company Isolation**: All major queries filtered by company_id
- **Role-Based Access**: Enforced in serverless functions
- **Data Ownership**: Clear parent-child relationships

### JSONB Usage Patterns
- **Flexible Schema**: `listings.enriched_data`, `brand_kits.theme`
- **API Responses**: `ai_generation_jobs.result_data`
- **Configuration**: `import_configurations.filters`
- **Metadata**: `media_assets.metadata`

## AI Processing Pipeline

### Job Queue System
1. **Job Creation**: Function creates job record
2. **External Queue**: Sent to Railway worker
3. **Provider API**: Worker calls AI provider
4. **Webhook Response**: Provider calls back when complete
5. **Asset Storage**: Download and store in Supabase
6. **User Notification**: Update UI via real-time

### Provider Selection Logic
- **Images**: OpenAI GPT-Image-1
- **Analysis**: OpenAI GPT-4/GPT-4 Vision
- **Video**: Pixverse (primary), Veo3 (cinematic)
- **Staging**: OpenAI + Replicate SAM

### Sequential Processing
- Video tours process pairs in sequence
- Each completion triggers next job
- Master job assembles final video
- Progress tracked across entire workflow

## API Endpoints

Base URL: `https://pzqsnwoerzjanxmmkavo.supabase.co/functions/v1/`

### Company & User Management
- **Company Operations**: `POST /company-management`
  - Actions: `create`, `invite`, `join`, `get_context`

### Property Management  
- **Listing CRUD**: `POST /listing-management`
  - Actions: `create`, `read`, `update`, `delete`, `publish`, `list`

- **Media Upload**: `POST /media-upload`  
  - Actions: `get_upload_urls`, `confirm_upload`, `delete_media`

- **Property Import**: `POST /listing-import-manager`
  - Actions: `import_from_url`, `enrich_address`, `upload_photos`, `upload_files`, `import_from_mls`, `scrape_batch`, `enhance_existing`, `auto_import_setup`

### Brand Management
- **Brand Kits**: `POST /brand-kit-manager`
  - Actions: `create`, `list`, `update_theme`, `set_default`, `upload_asset`, `delete_asset`, `get_assets`

- **AI Brand Creation**: `POST /ai-brand-kit-manager`  
  - Actions: `create_from_description`, `analyze_logo`, `extract_from_website`, `generate_variations`, `suggest_improvements`, `analyze_competitor`

### AI Content Generation
- **Real-time Generation**: `POST /ai-realtime`
  - 18 Actions: `generate_hero_image`, `generate_business_card`, `generate_social_post`, `generate_flyer`, `generate_copy`, `list_design_styles`, `generate_styled_business_card`, `generate_styled_business_card_with_reference`, `generate_styled_flyer`, `get_user_style_preferences`, `update_style_rating`, `populate_design_library`, `get_style_analytics`, `generate_weekly_analytics`, `generate_seasonal_batch`, `run_ab_seed_test`, `generate_styled_business_card_enhanced`, `regenerate_with_new_seed`

- **Virtual Staging**: `POST /ai-staging`
  - Actions: `virtual_staging`, `advanced_virtual_staging`, `pixel_perfect_staging`

- **Video Generation**: `POST /ai-video`
  - Actions: `plan_video_scenes`, `queue_video_tour`, `generate_video_tour`, `queue_property_video`, `generate_property_video`

- **Batch Processing**: `POST /ai-batch`
  - Actions: `queue_batch_content`, `queue_virtual_staging`

### Webhooks (Internal)
- **AI Provider Callbacks**: `POST /ai-webhooks/{provider}`
  - Providers: `pixverse`, `runway`, `veo3`, `replicate`, `elevenlabs`

## Request Format

All requests require:
```javascript
headers: {
  'Authorization': `Bearer ${userToken}`,
  'Content-Type': 'application/json'
}

body: {
  action: 'action_name',
  data: { /* action-specific parameters */ }
}
```

## Detailed Feature Breakdown

### AI Realtime - Complete Action List
**Core Generation (5 actions)**:
- `generate_hero_image` - Property hero images with listing data + brand kit integration
- `generate_business_card` - Agent business cards (legacy + styled versions)
- `generate_social_post` - Instagram/Facebook posts with platform optimization
- `generate_flyer` - Print-ready property flyers with QR codes
- `generate_copy` - Marketing copy for various platforms and purposes

**Design Library System (7 actions)**:
- `list_design_styles` - Browse 100+ templates with filtering by tags, audience, popularity
- `generate_styled_business_card` - Template-based cards with brand data injection
- `generate_styled_business_card_with_reference` - Reference image inspiration + template
- `generate_styled_flyer` - Template-based flyers
- `get_user_style_preferences` - Personalized recommendations based on usage
- `update_style_rating` - User feedback system for template improvement
- `regenerate_with_new_seed` - Generate variations of previous designs

**Admin & Analytics (6 actions)**:
- `populate_design_library` - Batch create new templates (admin only)
- `get_style_analytics` - Template performance metrics
- `generate_weekly_analytics` - Usage reports and insights  
- `generate_seasonal_batch` - Create themed template collections
- `run_ab_seed_test` - Template A/B testing system
- `generate_styled_business_card_enhanced` - Premium features (bleed, CMYK)

### Advanced AI Features

**Reference-Based Generation**:
- Upload inspiration images for style matching
- GPT-4 Vision analyzes reference aesthetics
- Combines template structure with reference inspiration
- Multi-image reference support (up to multiple references)

**Prompt Assembly System**:
- Template prompts with placeholder variables: `{{agent_name}}`, `{{brand_color}}`, etc.
- GPT-4 intelligently replaces placeholders with actual brand data
- Maintains design consistency while personalizing content
- Professional real estate standards enforcement

**Quality Tiers & Processing**:
- **Standard**: Direct GPT-Image-1 generation
- **Reference-Guided**: GPT-4 analysis + GPT-Image-1 generation  
- **Premium**: Multiple refinement passes + quality scoring

### Property Import - Multi-Source Waterfall

**Data Source Priority**:
1. **Zillow API** (Primary) - Property details, photos, Zestimate, virtual tours
2. **RentSpree** - Rental property data
3. **RealtyMole** - Property valuations and details
4. **Google Places** - Address validation fallback

**Property Type Normalization**:
- Maps various API property types to standardized enum
- Handles: single_family, condo, townhouse, land, commercial
- Fallback logic for unknown types

**Address Enrichment Process**:
1. Try property APIs for complete data + photos
2. Fall back to Google Places for address validation
3. Store enrichment source and confidence levels
4. Create listing with all available data

**Photo Import System**:
- Batch import up to 40 photos per listing
- Automatic photo ordering and primary selection
- Progress tracking with batch processing
- Error handling for failed downloads
- Metadata preservation (original URLs, file sizes)

### Video Generation - Sequential Processing

**Video Pair Planning**:
- GPT-4 analyzes uploaded photos for quality and content
- Intelligently filters out blurry/repetitive images
- Creates strategic pairings (wide + detail shots, spatial flow)
- Generates custom prompts for each transition

**Sequential Processing Logic**:
1. Master job created with all video pair data
2. Individual video pair jobs created with sequence order
3. First job sent to Railway worker immediately
4. Subsequent jobs wait for previous completion
5. Webhooks trigger next job in sequence
6. Master job assembles final video when all pairs complete

**External Worker Integration**:
- Railway deployment handles actual AI provider calls
- Webhook callbacks update Supabase job status
- Queue system handles priority and load balancing
- Automatic retry logic for failed jobs

**Provider Routing Logic**:
- **Pixverse**: Primary for all video types (updated from Runway)
- **Veo3**: Ultra-cinematic content under 15 seconds
- **Runway**: Fallback for specific use cases
- Automatic selection based on duration, style, and quality requirements

### Virtual Staging - Three-Tier System

**Basic Staging**:
- GPT-4 Vision analyzes room layout and lighting  
- GPT-Image-1 generates staged version
- Preserves original architecture and lighting
- Simple furniture placement and styling

**Advanced Staging with SAM**:
- Meta SAM generates precise furniture masks
- GPT-4 analyzes masked regions for optimal placement
- GPT-Image-1 inpainting for pixel-perfect results
- Quality review system with automatic refinement

**Pixel-Perfect Premium**:
- Multiple refinement passes
- Quality scoring and improvement suggestions
- Fallback to bounding box method if SAM fails
- Professional real estate staging standards

### Brand Management Workflows

**AI Brand Creation Modes**:
- **From Description**: Company details → Complete brand strategy + visual identity
- **Logo Analysis**: Upload logo → Extract colors, fonts, style recommendations  
- **Website Scraping**: Analyze existing site → Extract brand elements + improvements
- **Competitive Analysis**: Research market positioning and opportunities

**Brand Kit Components**:
- **Theme**: Colors, typography, visual style (JSONB storage)
- **Voice**: Personality, tone, messaging guidelines
- **Assets**: Logos, fonts, templates stored in brand-assets bucket
- **Variations**: Seasonal, contextual, audience-specific adaptations

**Default Management**:
- Only one default brand kit per company
- Used automatically in all AI content generation
- Clear other defaults when setting new default
- RPC function: `fn_clear_other_defaults`

### Job Queue & Processing System

**Job Types & Relationships**:
- **Parent Jobs**: `batch_content`, `video_tour_master`
- **Child Jobs**: Individual content items, video pairs
- **Sequential Jobs**: Video pairs with `wait_for_previous` flag
- **Independent Jobs**: Single content generation

**External Queue Architecture**:
- Railway worker handles actual AI provider integration
- Webhook system for completion callbacks
- Priority queue (low, normal, high, urgent)
- Cost tracking and usage limits

**Status Flow**:
```
queued → processing → completed/failed
↓
webhook → asset_storage → user_notification
```

### Analytics & Tracking Features

**Event Tracking**:
- All AI generation tracked via `fn_track_event`
- User behavior analytics
- Company usage metrics  
- Cost tracking per provider

**Performance Monitoring**:
- Template popularity scoring
- User preference learning
- Quality feedback integration
- A/B testing for template effectiveness

**Usage Analytics**:
- GPT token usage tracking
- Cost per company/user
- Monthly usage reports
- Tier-based limits and billing

### Import Automation System

**Configuration Management**:
- `import_configurations` table stores automation rules
- Schedule-based imports (cron-like scheduling)
- Filter systems for property criteria
- Multiple source integration

**Automation Runs**:
- Tracks import execution history
- Success/failure metrics  
- Error logging and debugging
- Performance optimization

### Notification & Real-time Features

**Notification Types**:
- AI content completion alerts
- Job status updates  
- Error notifications
- Usage limit warnings

**Real-time Integration**:
- Supabase real-time subscriptions
- Live job progress updates
- Collaborative editing features
- Multi-user company access

## Frontend Architecture Recommendations

### State Management
- **User Context**: Global state with company_id, role
- **Listings**: Company-scoped with real-time updates
- **Jobs**: Real-time status tracking
- **Media**: Asset management with upload states

### Real-time Features
- **Job Progress**: Supabase real-time subscriptions
- **Collaboration**: Multi-user listing editing
- **Notifications**: In-app status updates

### UI Patterns
- **Company Selector**: Switch between companies (multi-tenant users)
- **Permission Gates**: Hide/show features based on role
- **Async Operations**: Progress bars, status indicators
- **Media Galleries**: Grid views with lazy loading

### API Integration
- **Function Routing**: Direct calls to Edge Functions
- **Error Handling**: Standardized error responses
- **Loading States**: Progress tracking for long operations
- **Caching**: Listing and media asset caching

## Content Generation Workflows

### Standard Generation Flow
1. User selects content type
2. Choose listing (optional) and parameters
3. Function calls AI provider
4. Real-time progress updates
5. Download/preview generated content

### Template-Based Flow
1. Browse design library
2. Select template and customization
3. AI assembles prompts with brand data
4. Generate with consistent styling
5. Save to user preferences

### Batch Processing Flow
1. Multi-select listings
2. Choose content types and settings
3. System creates parent + child jobs
4. Queue for sequential processing
5. Dashboard shows overall progress

## Import & Data Management

### Property Import Flow
1. URL or address input
2. AI extraction or API lookup
3. Data validation and enhancement
4. Photo import and processing
5. Listing creation with enriched data

### Brand Asset Management
1. Upload logos, fonts, brand assets
2. AI analysis of brand elements
3. Template personalization
4. Consistent brand application

### Media Organization
- **Listing-based folders**: `/listing_id/filename`
- **Asset kinds**: Categorized by type and AI generation
- **Metadata tracking**: Original names, upload details
- **Storage optimization**: Automatic compression and formats

This architecture provides a solid foundation for building a comprehensive real estate AI studio with clear separation of concerns, robust multi-tenancy, and scalable AI processing capabilities.