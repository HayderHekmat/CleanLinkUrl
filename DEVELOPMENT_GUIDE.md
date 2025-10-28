# LinkAura Development Guide
## Developer Documentation

### Version: 2.0
### Last Updated: December 2024

---

## 1. Development Setup

### 1.1 Prerequisites
- **Node.js**: 16+ (for development tools)
- **Git**: For version control
- **Modern Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Text Editor**: VS Code, Sublime Text, or similar
- **Cloudflare Account**: For Worker deployment

### 1.2 Local Development

#### Clone Repository
```bash
git clone https://github.com/your-username/linkaura.git
cd linkaura
```

#### Start Local Server
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx live-server --port=8080

# Using PHP
php -S localhost:8080
```

#### Access Application
```
http://localhost:8080
```

### 1.3 Development Tools

#### Recommended VS Code Extensions
- **Live Server**: For local development
- **Prettier**: Code formatting
- **ESLint**: JavaScript linting
- **HTML CSS Support**: Better HTML/CSS support
- **Auto Rename Tag**: HTML tag management

#### Browser DevTools
- **Chrome DevTools**: Primary debugging tool
- **Network Tab**: Monitor API calls
- **Console**: JavaScript debugging
- **Application Tab**: LocalStorage inspection

---

## 2. Project Structure

### 2.1 File Organization
```
CleanLinkUrl/
├── index.html              # Main application (3,896 lines)
├── worker.js               # Cloudflare Worker proxy (269 lines)
├── service-worker.js       # PWA service worker (46 lines)
├── feature-works.js        # Future features (disabled)
├── manifest.json           # PWA manifest
├── assets/
│   ├── images/            # Icons and images
│   │   ├── cleanlink-icon.png
│   │   └── favicon.png
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript libraries
├── SPECIFICATION.md        # Technical specification
├── API_DOCUMENTATION.md    # API documentation
├── USER_GUIDE.md          # User manual
├── DEVELOPMENT_GUIDE.md   # This file
└── README.md              # Project overview
```

### 2.2 Code Organization

#### HTML Structure
- **Head Section**: Meta tags, SEO, PWA manifest
- **Body Section**: Main UI components
- **Scripts**: Inline JavaScript for functionality

#### JavaScript Architecture
- **Global Variables**: DOM elements and configuration
- **Core Functions**: URL cleaning and validation
- **API Functions**: External API integrations
- **UI Functions**: User interface management
- **Utility Functions**: Helper functions

---

## 3. Core Development Concepts

### 3.1 URL Processing Pipeline

#### Input Validation
```javascript
function normalizeUrl(raw) {
  // Add protocol if missing
  if (!raw.match(/^https?:\/\//i)) {
    raw = 'https://' + raw;
  }
  return new URL(raw);
}
```

#### Parameter Removal
```javascript
function cleanURL(raw, preserveList = []) {
  const preserve = new Set(preserveList.map(s => s.trim().toLowerCase()));
  const removeAll = document.getElementById("removeAll").checked;
  const url = normalizeUrl(raw);
  const params = url.searchParams;
  const keysToDelete = [];
  
  params.forEach((_, key) => {
    const lower = key.toLowerCase();
    if ((removeAll || lower.startsWith("utm_") || ["fbclid", "gclid"].includes(lower)) 
        && !preserve.has(lower)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(k => params.delete(k));
  return url.toString();
}
```

### 3.2 API Integration Pattern

#### Cloudflare Worker Proxy
```javascript
// worker.js
const routes = {
  "/safety-check": "https://api.linkaura.com/safety-check",
  "/ssl-check": "https://api.linkaura.com/ssl-check",
  "/websecscan": "https://n8n.digital-ai-home.de/webhook/websecscan"
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const endpoint = routes[url.pathname];
  
  if (endpoint) {
    return await fetch(endpoint, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }
}
```

#### Frontend API Calls
```javascript
async function callLinkAuraAPI(endpoint, body = {}) {
  if (!isAnyApiOptionSelected()) {
    return { error: "No API options selected", offline: true };
  }
  
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify(body)
  });
  
  return await response.json();
}
```

### 3.3 State Management

#### LocalStorage Usage
```javascript
// User preferences
localStorage.setItem("cleanlink_privacy", "true");
localStorage.setItem("linkaura_history", JSON.stringify(history));

// API usage tracking
localStorage.setItem("cleanlink_usage", usage.toString());
localStorage.setItem("cleanlink_date", today);

// Supporter data
localStorage.setItem("cleanlink_supporter_token", token);
localStorage.setItem("cleanlink_supporter_expiry", expiry.toString());
```

#### Session Management
```javascript
// JWT token management
sessionStorage.setItem('linkaura_jwt', jwtToken);

// API connection status
let apiConnectionStatus = 'disconnected';
```

---

## 4. Feature Development

### 4.1 Adding New Security Features

#### Step 1: Create Function
```javascript
async function checkNewSecurityFeature(url) {
  const statusEl = document.getElementById("newFeatureStatus");
  const iconEl = document.getElementById("newFeatureIcon");
  const textEl = document.getElementById("newFeatureText");
  
  if (!statusEl) return;
  
  try {
    // API call logic
    const result = await callLinkAuraAPI("new-feature", { url });
    
    // Update UI
    statusEl.classList.remove("hidden");
    iconEl.textContent = "verified";
    iconEl.className = "material-symbols-outlined text-base text-green-500";
    textEl.textContent = "Security check passed";
    
  } catch (error) {
    // Error handling
    statusEl.classList.remove("hidden");
    iconEl.textContent = "error";
    iconEl.className = "material-symbols-outlined text-base text-red-500";
    textEl.textContent = "Security check failed";
  }
}
```

#### Step 2: Add UI Elements
```html
<div id="newFeatureStatus" class="hidden mt-3 flex items-center gap-2 text-sm">
  <span id="newFeatureIcon" class="material-symbols-outlined text-base"></span>
  <span id="newFeatureText"></span>
</div>
```

#### Step 3: Add Checkbox
```html
<label class="flex items-center gap-2">
  <input id="newFeatureCheck" type="checkbox" class="rounded border-slate-600">
  <span>New Security Feature</span>
</label>
```

#### Step 4: Integrate with Main Flow
```javascript
// In runUnlimitedSecurityChecks function
const shouldCheckNewFeature = document.getElementById("newFeatureCheck").checked;
if (shouldCheckNewFeature && !isPrivacy) {
  checkNewSecurityFeature(cleaned);
}
```

### 4.2 Adding New Local Features

#### Example: URL Length Analysis
```javascript
function checkUrlLength(url) {
  const lengthStatusEl = document.getElementById("urlLengthStatus");
  const lengthIconEl = document.getElementById("urlLengthIcon");
  const lengthTextEl = document.getElementById("urlLengthText");
  
  if (!lengthStatusEl) return;
  
  const length = url.length;
  const isLong = length > 2000;
  
  lengthStatusEl.classList.remove("hidden");
  
  if (isLong) {
    lengthIconEl.textContent = "warning";
    lengthIconEl.className = "material-symbols-outlined text-base text-yellow-500";
    lengthTextEl.textContent = `Very long URL (${length} characters)`;
  } else {
    lengthIconEl.textContent = "verified";
    lengthIconEl.className = "material-symbols-outlined text-base text-green-500";
    lengthTextEl.textContent = `URL length OK (${length} characters)`;
  }
}
```

---

## 5. API Development

### 5.1 Cloudflare Worker Development

#### Local Testing
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
wrangler deploy
```

#### Worker Structure
```javascript
// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Route handling
  const endpoint = routes[url.pathname];
  if (endpoint) {
    return await proxyRequest(request, endpoint);
  }
  
  return new Response('Not Found', { status: 404 });
}
```

### 5.2 n8n Workflow Integration

#### Creating New Workflow
1. **Access n8n**: Login to your n8n instance
2. **Create Workflow**: New workflow from template
3. **Configure Webhook**: Set up webhook trigger
4. **Add Processing**: Add nodes for data processing
5. **Test Workflow**: Test with sample data
6. **Deploy**: Activate workflow

#### Webhook Configuration
```json
{
  "httpMethod": "POST",
  "path": "new-feature",
  "responseMode": "responseNode",
  "options": {
    "cors": {
      "enabled": true,
      "origin": "*"
    }
  }
}
```

---

## 6. Testing

### 6.1 Unit Testing

#### URL Cleaning Tests
```javascript
function testUrlCleaning() {
  const testCases = [
    {
      input: "https://example.com?utm_source=google&id=123",
      expected: "https://example.com?id=123",
      description: "Remove utm_source, keep id"
    },
    {
      input: "https://example.com?fbclid=abc123&gclid=def456",
      expected: "https://example.com",
      description: "Remove all tracking parameters"
    }
  ];
  
  testCases.forEach(test => {
    const result = cleanURL(test.input);
    console.assert(result === test.expected, 
      `${test.description}: Expected ${test.expected}, got ${result}`);
  });
}
```

#### API Integration Tests
```javascript
async function testApiIntegration() {
  try {
    const result = await callLinkAuraAPI("safety-check", {
      url: "https://httpbin.org/get"
    });
    
    console.assert(result.verdict, "Safety API should return verdict");
    console.assert(typeof result.confidence === 'number', 
      "Confidence should be a number");
    
  } catch (error) {
    console.error("API test failed:", error);
  }
}
```

### 6.2 Integration Testing

#### End-to-End Test
```javascript
async function testFullWorkflow() {
  // Test URL cleaning
  const cleaned = cleanURL("https://example.com?utm_source=test");
  console.assert(cleaned === "https://example.com", "URL cleaning failed");
  
  // Test API integration
  const safetyResult = await checkSafetyAPI(cleaned);
  console.assert(safetyResult, "Safety API failed");
  
  // Test UI updates
  const statusEl = document.getElementById("safetyApiStatus");
  console.assert(!statusEl.classList.contains("hidden"), "UI not updated");
}
```

### 6.3 Performance Testing

#### Load Testing
```javascript
async function performanceTest() {
  const startTime = performance.now();
  
  // Test multiple URL cleanings
  for (let i = 0; i < 100; i++) {
    cleanURL(`https://example${i}.com?utm_source=test&id=${i}`);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`Processed 100 URLs in ${duration}ms`);
  console.assert(duration < 1000, "Performance test failed");
}
```

---

## 7. Debugging

### 7.1 Common Debugging Techniques

#### Console Logging
```javascript
// Debug API calls
async function callLinkAuraAPI(endpoint, body = {}) {
  console.log('🔗 API Call:', endpoint, body);
  
  try {
    const response = await fetch(`/api/${endpoint}`, options);
    const result = await response.json();
    
    console.log('✅ API Response:', result);
    return result;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}
```

#### Error Boundaries
```javascript
// Wrap functions in try-catch
async function safeApiCall(endpoint, body) {
  try {
    return await callLinkAuraAPI(endpoint, body);
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error.message, offline: true };
  }
}
```

### 7.2 Browser DevTools

#### Network Tab
- Monitor API requests
- Check response times
- Verify request/response data
- Debug CORS issues

#### Console Tab
- View JavaScript errors
- Monitor console.log output
- Test functions interactively
- Debug variable values

#### Application Tab
- Inspect LocalStorage
- Check SessionStorage
- View service worker status
- Debug PWA features

---

## 8. Deployment

### 8.1 Frontend Deployment

#### GitHub Pages
```bash
# Build and deploy
git add .
git commit -m "Deploy to production"
git push origin main

# GitHub Pages will automatically deploy
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir .
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 8.2 Cloudflare Worker Deployment

#### Using Wrangler
```bash
# Deploy worker
wrangler deploy

# Deploy with environment variables
wrangler deploy --env production
```

#### Using Cloudflare Dashboard
1. Go to Cloudflare Dashboard
2. Select Workers & Pages
3. Create new Worker
4. Paste worker.js code
5. Deploy

### 8.3 n8n Workflow Deployment

#### Self-Hosted
1. Install n8n
2. Import workflow JSON
3. Configure credentials
4. Activate workflow

#### n8n Cloud
1. Create n8n Cloud account
2. Import workflow
3. Configure webhooks
4. Test and activate

---

## 9. Performance Optimization

### 9.1 Frontend Optimization

#### Code Splitting
```javascript
// Lazy load heavy features
async function loadAdvancedFeatures() {
  const module = await import('./advanced-features.js');
  return module;
}
```

#### Caching Strategy
```javascript
// Cache API responses
const apiCache = new Map();

async function cachedApiCall(endpoint, body) {
  const key = `${endpoint}-${JSON.stringify(body)}`;
  
  if (apiCache.has(key)) {
    return apiCache.get(key);
  }
  
  const result = await callLinkAuraAPI(endpoint, body);
  apiCache.set(key, result);
  return result;
}
```

### 9.2 Worker Optimization

#### Response Caching
```javascript
// Cache responses in Worker
const cache = caches.default;

async function cachedResponse(request) {
  const cacheKey = new Request(request.url);
  const cached = await cache.match(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  await cache.put(cacheKey, response.clone());
  return response;
}
```

---

## 10. Security Considerations

### 10.1 Input Validation

#### URL Validation
```javascript
function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    // Check hostname
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      throw new Error('Invalid hostname');
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
```

#### XSS Prevention
```javascript
function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}
```

### 10.2 API Security

#### JWT Validation
```javascript
async function validateJWT(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check expiration
    if (payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

#### Rate Limiting
```javascript
const rateLimits = new Map();

function checkRateLimit(userId, limit = 100) {
  const now = Date.now();
  const userRequests = rateLimits.get(userId) || [];
  
  // Remove old requests
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
}
```

---

## 11. Contributing

### 11.1 Development Workflow

#### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/new-security-check

# Make changes
git add .
git commit -m "Add new security check feature"

# Push branch
git push origin feature/new-security-check

# Create pull request
```

#### Code Style
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use camelCase for variables
- Use PascalCase for functions

### 11.2 Pull Request Process

#### Before Submitting
1. Test your changes thoroughly
2. Update documentation if needed
3. Ensure code follows style guidelines
4. Add tests for new features

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

---

## 12. Maintenance

### 12.1 Regular Tasks

#### Weekly
- Review error logs
- Check API performance
- Update dependencies
- Monitor usage statistics

#### Monthly
- Security audit
- Performance review
- Feature usage analysis
- Documentation updates

#### Quarterly
- Major version updates
- Security patches
- Feature deprecation
- Architecture review

### 12.2 Monitoring

#### Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});
```

#### Performance Monitoring
```javascript
// Monitor API response times
const startTime = performance.now();
const result = await callLinkAuraAPI(endpoint, body);
const duration = performance.now() - startTime;

if (duration > 5000) {
  console.warn('Slow API response:', duration);
}
```

---

*This development guide provides comprehensive information for developers working on LinkAura. For specific implementation details, refer to the source code and inline comments.*
