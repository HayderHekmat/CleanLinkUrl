# LinkAura - URL Privacy & Security Tool
## Technical Specification Document

### Version: 2.0
### Last Updated: December 2024

---

## 1. Project Overview

### 1.1 Purpose
LinkAura is a privacy-focused web application that removes tracking parameters from URLs while providing advanced security analysis features. The tool helps users maintain privacy by cleaning URLs of tracking elements and offers comprehensive security assessments.

### 1.2 Key Features
- **URL Parameter Cleaning**: Removes tracking parameters (utm_*, fbclid, gclid)
- **Security Analysis**: Multiple security check APIs
- **Language Detection**: Automatic web page language identification
- **Accessibility Analysis**: WCAG compliance testing and scoring
- **Privacy Protection**: No user tracking, no ads
- **Local Features**: Unlimited free local functionality
- **Premium APIs**: Tiered usage limits for advanced features

---

## 2. Architecture Overview

### 2.1 Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Cloudflare Workers
- **APIs**: LinkAura API, n8n Workflows
- **Authentication**: JWT tokens
- **Storage**: LocalStorage, SessionStorage

### 2.2 File Structure
```
CleanLinkUrl/
├── index.html              # Main application file
├── worker.js               # Cloudflare Worker proxy
├── service-worker.js       # PWA service worker
├── feature-works.js        # Future features (disabled)
├── manifest.json           # PWA manifest
├── assets/
│   ├── images/            # Icons and images
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript libraries
└── robots.txt             # SEO configuration
```

---

## 3. Core Functionality

### 3.1 URL Cleaning Engine

#### 3.1.1 Primary Function: `cleanURL(raw, preserveList)`
**Purpose**: Removes tracking parameters from URLs while preserving specified parameters.

**Parameters**:
- `raw` (string): Input URL to clean
- `preserveList` (array): List of parameters to preserve

**Process**:
1. Normalize URL using `normalizeUrl()` function
2. Extract search parameters
3. Identify tracking parameters:
   - `utm_*` (Google Analytics)
   - `fbclid` (Facebook)
   - `gclid` (Google Ads)
4. Remove identified parameters unless in preserve list
5. Handle special cases (Amazon affiliate tags)
6. Clean hash fragments containing tracking parameters

**Return**: Cleaned URL string

#### 3.1.2 URL Normalization
- Adds protocol if missing (defaults to HTTPS)
- Handles common URL format issues
- Validates URL structure

### 3.2 Security Analysis Features

#### 3.2.1 Safety API (`checkSafetyAPI`)
**Purpose**: Analyzes URL safety using community database.

**Features**:
- Threat score calculation
- Community verification
- Confidence scoring
- Daily usage limits (3 calls for free users)

**API Endpoint**: `/safety-check`

#### 3.2.2 SSL Certificate API (`checkSslApiCertificate`)
**Purpose**: Validates SSL certificate information.

**Features**:
- Certificate validity checking
- Expiration date analysis
- Grade assessment (A+ to F)
- Issuer information

**API Endpoint**: `/ssl-check`

#### 3.2.3 WebSecScan AI Security (`checkWebSecScan`)
**Purpose**: AI-powered website security analysis.

**Features**:
- Dual-layer security analysis
- Header configuration audit
- Vulnerability assessment
- Professional HTML report generation
- Security grading (A+ to F)

**Integration**: n8n workflow (WebSecScan template)
**API Endpoint**: `/websecscan`

### 3.3 Local Analysis Features

#### 3.3.1 URL Structure Analysis (`checkUrlAnalysis`)
**Purpose**: Analyzes URL structure for suspicious patterns.

**Analysis**:
- Subdomain count
- Parameter count
- Path depth
- Shortener detection
- Suspicious pattern detection

#### 3.3.2 Link Expiration Check (`checkLinkExpiration`)
**Purpose**: Checks if shortened URLs are still active.

**Process**:
- Detects URL shorteners
- Tests link accessibility
- Reports expiration status

#### 3.3.3 Social Media Detection (`checkSocialMedia`)
**Purpose**: Identifies social media platforms.

**Supported Platforms**:
- Facebook, Twitter/X, Instagram
- LinkedIn, YouTube, TikTok
- Snapchat, Pinterest, Reddit
- Discord, Telegram, WhatsApp

#### 3.3.4 URL Validation & Repair (`checkUrlValidation`)
**Purpose**: Validates and repairs malformed URLs.

**Repair Features**:
- Protocol addition
- Typo correction
- Domain fixes
- Format validation

---

## 4. User Interface

### 4.1 Main Interface Components

#### 4.1.1 URL Input Section
- **URL Input Field**: Primary input for URLs to clean
- **Clean Button**: Triggers URL cleaning process
- **Preserve Parameters Dropdown**: Select parameters to keep
- **Remove All Checkbox**: Option to remove all parameters

#### 4.1.2 Security Options
- **Safety API Checkbox**: Enable community safety check
- **SSL API Checkbox**: Enable SSL certificate validation
- **WebSecScan Checkbox**: Enable AI security analysis
- **Privacy Mode Toggle**: Disable all API calls

#### 4.1.3 Local Features
- **URL Analysis**: Structure analysis
- **Link Expiration**: Shortener validation
- **Social Media Detection**: Platform identification
- **URL Validation**: Format checking and repair

#### 4.1.4 Results Display
- **Cleaned URL**: Primary result display
- **QR Code**: Generated QR code for cleaned URL
- **Action Buttons**: Copy, Open, Share, Download QR
- **Security Status**: Real-time security analysis results

### 4.2 Statistics Dashboard

#### 4.2.1 Overview Cards
- Total URLs cleaned
- Unique domains processed
- Average parameters removed
- Security checks performed

#### 4.2.2 Charts
- **Top Domains**: Most cleaned domains
- **Parameter Types**: Most removed parameters
- **Recent Activity**: Daily cleaning activity

#### 4.2.3 Export Features
- CSV export for URL history
- JSON export for statistics
- Reset functionality

---

## 5. API Integration

### 5.1 Cloudflare Worker Proxy (`worker.js`)

#### 5.1.1 Purpose
Acts as a proxy between the frontend and external APIs to handle CORS issues and provide unified authentication.

#### 5.1.2 Endpoints
```javascript
const routes = {
  "/safety-check": "https://api.linkaura.com/safety-check",
  "/ssl-check": "https://api.linkaura.com/ssl-check", 
  "/websecscan": "https://n8n.digital-ai-home.de/webhook/websecscan",
  "/domain-age": "https://n8n.digital-ai-home.de/webhook/domain-age",
  "/malware-check": "https://n8n.digital-ai-home.de/webhook/malware-check",
  "/ClickCounter": "https://n8n.digital-ai-home.de/webhook/ClickCounter"
};
```

#### 5.1.3 Authentication
- JWT token generation and validation
- HMAC-SHA256 signing
- 5-minute token expiration
- Automatic refresh mechanism

### 5.2 LinkAura API Integration

#### 5.2.1 Authentication Flow
1. Generate JWT payload with user context
2. Sign token with HMAC-SHA256
3. Include token in API requests
4. Handle token refresh automatically

#### 5.2.2 Rate Limiting
- **Free Users**: 3 API calls per day
- **Coffee Supporters**: 10 API calls per day
- **Supporter Tier**: 50 API calls per day
- **Champion Tier**: Unlimited API calls

---

## 6. Data Management

### 6.1 Local Storage

#### 6.1.1 User Data
- `linkaura_history`: URL cleaning history
- `cleanlink_usage`: Daily API usage counter
- `cleanlink_date`: Last usage date
- `cleanlink_privacy`: Privacy mode preference

#### 6.1.2 Supporter Data
- `cleanlink_supporter_token`: Supporter authentication token
- `cleanlink_supporter_expiry`: Token expiration timestamp
- `cleanlink_supporter_tier`: Supporter tier (coffee/supporter/champion)
- `cleanlink_supporter_api_calls`: Daily API call limit

#### 6.1.3 API Data
- `linkaura_jwt`: JWT authentication token
- `cleanlink_globalCount`: Global usage counter

### 6.2 Session Storage
- `linkaura_jwt`: Current session JWT token
- API connection status
- User preferences

---

## 7. Security Features

### 7.1 Privacy Protection
- **No User Tracking**: No analytics or tracking scripts
- **No Ads**: Completely ad-free experience
- **Local Processing**: Most features run locally
- **Data Minimization**: Minimal data collection

### 7.2 Input Validation
- **URL Sanitization**: Prevents XSS attacks
- **Parameter Validation**: Validates input parameters
- **HTML Escaping**: Escapes user-generated content

### 7.3 API Security
- **JWT Authentication**: Secure API access
- **Rate Limiting**: Prevents abuse
- **CORS Handling**: Secure cross-origin requests
- **Error Handling**: Graceful error management

---

## 8. Progressive Web App (PWA)

### 8.1 Service Worker (`service-worker.js`)
- **Caching Strategy**: Cache-first for static assets
- **Offline Support**: Basic offline functionality
- **Update Management**: Automatic cache updates

### 8.2 Manifest (`manifest.json`)
- **App Identity**: Name, description, icons
- **Display Mode**: Standalone app experience
- **Theme Colors**: Brand color scheme
- **Start URL**: Application entry point

---

## 9. Performance Optimization

### 9.1 Loading Performance
- **Minimal Dependencies**: Lightweight libraries
- **Lazy Loading**: On-demand feature loading
- **Caching**: Aggressive caching strategy
- **Compression**: Optimized asset delivery

### 9.2 Runtime Performance
- **Efficient Algorithms**: Optimized URL processing
- **Memory Management**: Proper cleanup
- **Event Handling**: Efficient event listeners
- **API Optimization**: Minimal API calls

---

## 10. Browser Compatibility

### 10.1 Supported Browsers
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### 10.2 Required Features
- **ES6+ Support**: Modern JavaScript features
- **Fetch API**: HTTP requests
- **LocalStorage**: Data persistence
- **Crypto API**: JWT generation
- **URL API**: URL manipulation

---

## 11. Deployment

### 11.1 Frontend Deployment
- **Static Hosting**: GitHub Pages, Netlify, Vercel
- **CDN**: Cloudflare for global distribution
- **HTTPS**: Required for PWA features

### 11.2 Backend Deployment
- **Cloudflare Workers**: Serverless API proxy
- **n8n Workflows**: Automation and API integration
- **Domain**: Custom domain configuration

---

## 12. Future Enhancements

### 12.1 Planned Features (`feature-works.js`)
- **Domain Age Check**: WHOIS-based domain analysis
- **Malware Detection**: Virus scanning integration
- **Advanced Analytics**: Enhanced statistics
- **Bulk Processing**: Multiple URL processing

### 12.2 Potential Improvements
- **Machine Learning**: Enhanced threat detection
- **API Expansion**: Additional security services
- **Mobile App**: Native mobile application
- **Enterprise Features**: Team management tools

---

## 13. Maintenance

### 13.1 Regular Updates
- **Security Patches**: Regular security updates
- **Feature Updates**: New functionality additions
- **Performance Optimization**: Continuous improvement
- **Bug Fixes**: Issue resolution

### 13.2 Monitoring
- **Error Tracking**: JavaScript error monitoring
- **Performance Metrics**: Load time monitoring
- **Usage Analytics**: Feature usage tracking
- **API Health**: External API monitoring

---

*This specification document provides a comprehensive overview of the LinkAura application architecture, functionality, and implementation details. For technical implementation questions, refer to the source code comments and inline documentation.*
