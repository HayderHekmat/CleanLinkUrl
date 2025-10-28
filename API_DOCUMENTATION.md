# LinkAura API Documentation
## External API Integration Guide

### Version: 2.0
### Last Updated: December 2024

---

## 1. Overview

LinkAura integrates with multiple external APIs to provide comprehensive URL cleaning and security analysis. This document outlines the API endpoints, authentication methods, and data formats used throughout the application.

---

## 2. Cloudflare Worker Proxy

### 2.1 Base URL
```
https://linkaura-worker.your-domain.workers.dev
```

### 2.2 Purpose
The Cloudflare Worker acts as a proxy to handle CORS issues and provide unified authentication for all external API calls.

---

## 3. LinkAura API Endpoints

### 3.1 Safety Check API

#### Endpoint
```
POST /safety-check
```

#### Purpose
Analyzes URL safety using community database and threat intelligence.

#### Request Format
```json
{
  "url": "https://example.com",
  "user_email": "user@example.com",
  "user_tier": "free",
  "is_supporter": false,
  "usage_count": 1,
  "scan_type": "safety_check",
  "timestamp": "2024-12-01T10:00:00Z",
  "client_version": "2.0"
}
```

#### Response Format
```json
{
  "verdict": "safe|suspicious|malicious",
  "confidence": 85,
  "threat_score": 15,
  "reasons": [
    "Community verified safe",
    "No malicious patterns detected"
  ],
  "timestamp": "2024-12-01T10:00:01Z"
}
```

#### Status Codes
- `200`: Success
- `401`: Authentication failed
- `429`: Rate limit exceeded
- `500`: Internal server error

---

### 3.2 SSL Certificate API

#### Endpoint
```
POST /ssl-check
```

#### Purpose
Validates SSL certificate information and security configuration.

#### Request Format
```json
{
  "url": "https://example.com",
  "user_email": "user@example.com",
  "user_tier": "free",
  "is_supporter": false,
  "usage_count": 1,
  "scan_type": "ssl_check",
  "timestamp": "2024-12-01T10:00:00Z",
  "client_version": "2.0"
}
```

#### Response Format
```json
{
  "verdict": "valid|expired|invalid",
  "grade": "A+",
  "days_left": 30,
  "issuer": "Let's Encrypt",
  "valid_from": "2024-11-01T00:00:00Z",
  "valid_to": "2024-12-01T00:00:00Z",
  "timestamp": "2024-12-01T10:00:01Z"
}
```

#### Status Codes
- `200`: Success
- `401`: Authentication failed
- `429`: Rate limit exceeded
- `500`: Internal server error

---

### 3.3 WebSecScan AI Security API

#### Endpoint
```
POST /websecscan
```

#### Purpose
AI-powered comprehensive website security analysis using OpenAI models.

#### Request Format
```json
{
  "url": "https://example.com",
  "user_email": "user@example.com",
  "user_tier": "free",
  "is_supporter": false,
  "usage_count": 1,
  "scan_type": "websecscan",
  "timestamp": "2024-12-01T10:00:00Z",
  "client_version": "2.0"
}
```

#### Response Format
```json
{
  "score": 85,
  "grade": "B+",
  "verdict": "moderate_security",
  "findings": {
    "critical": 0,
    "warning": 3,
    "info": 5
  },
  "headers": {
    "content_security_policy": "present",
    "strict_transport_security": "missing",
    "x_frame_options": "present"
  },
  "recommendations": [
    "Implement HSTS header",
    "Configure CSP policy"
  ],
  "html_report": "<html>...</html>",
  "timestamp": "2024-12-01T10:00:01Z"
}
```

#### Status Codes
- `200`: Success
- `401`: Authentication failed
- `429`: Rate limit exceeded
- `500`: Internal server error

---

## 4. n8n Workflow Integration

### 4.1 WebSecScan Workflow

#### Template Reference
```
https://n8n.io/workflows/3314-websecscan-ai-powered-website-security-auditor/
```

#### Features
- **Dual-Layer Analysis**: Header configuration and vulnerability assessment
- **AI-Powered**: Uses OpenAI GPT models for analysis
- **Professional Reports**: Generates detailed HTML security reports
- **Security Grading**: Automatic A+ to F grading system

#### Setup Requirements
1. **OpenAI API Key**: Required for AI analysis
2. **Gmail Integration**: For report delivery (optional)
3. **n8n Instance**: Self-hosted or cloud deployment

---

### 4.2 Domain Age Workflow

#### Purpose
Analyzes domain registration and age information.

#### Request Format
```json
{
  "url": "https://example.com",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

#### Response Format
```json
{
  "domain": "example.com",
  "age_days": 3650,
  "age_years": 10,
  "registrar": "Example Registrar",
  "created_date": "2014-01-01T00:00:00Z",
  "expires_date": "2025-01-01T00:00:00Z",
  "status": "active"
}
```

---

### 4.3 Malware Check Workflow

#### Purpose
Scans URLs for malware and malicious content.

#### Request Format
```json
{
  "url": "https://example.com",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

#### Response Format
```json
{
  "verdict": "clean|suspicious|malicious",
  "confidence": 95,
  "engines": {
    "urlscan": "clean",
    "safebrowsing": "clean",
    "phishtank": "clean"
  },
  "threats": [],
  "timestamp": "2024-12-01T10:00:01Z"
}
```

---

## 5. Authentication

### 5.1 JWT Token Structure

#### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload
```json
{
  "user_email": "user@example.com",
  "user_tier": "free|coffee|supporter|champion",
  "is_supporter": true,
  "usage_count": 1,
  "iat": 1701432000,
  "exp": 1701432300
}
```

#### Signature
HMAC-SHA256 signature using secret key.

### 5.2 Token Management

#### Generation
- Created by Cloudflare Worker
- 5-minute expiration
- Automatic refresh mechanism
- Stored in sessionStorage

#### Validation
- Server-side validation
- Signature verification
- Expiration checking
- User tier validation

---

## 6. Rate Limiting

### 6.1 Usage Limits by Tier

#### Free Tier
- **Daily Limit**: 3 API calls
- **Features**: Basic safety check, SSL validation
- **Reset**: Daily at midnight

#### Coffee Supporter
- **Daily Limit**: 10 API calls
- **Features**: All free features + WebSecScan
- **Duration**: 1 month

#### Supporter Tier
- **Daily Limit**: 50 API calls
- **Features**: All features + priority support
- **Duration**: 3 months

#### Champion Tier
- **Daily Limit**: Unlimited
- **Features**: All features + premium support
- **Duration**: 6 months

### 6.2 Rate Limit Headers

#### Response Headers
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1701432000
```

#### Error Response (429)
```json
{
  "error": "Rate limit exceeded",
  "limit": 3,
  "remaining": 0,
  "reset_time": "2024-12-01T11:00:00Z"
}
```

---

## 7. Error Handling

### 7.1 Standard Error Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

### 7.2 Common Error Codes

#### Authentication Errors
- `AUTH_INVALID_TOKEN`: Invalid JWT token
- `AUTH_EXPIRED_TOKEN`: Token has expired
- `AUTH_MISSING_TOKEN`: No token provided

#### Rate Limiting Errors
- `RATE_LIMIT_EXCEEDED`: Daily limit exceeded
- `RATE_LIMIT_INVALID_TIER`: Invalid user tier

#### API Errors
- `API_UNAVAILABLE`: External API unavailable
- `API_INVALID_REQUEST`: Invalid request format
- `API_TIMEOUT`: Request timeout

#### Validation Errors
- `VALIDATION_INVALID_URL`: Invalid URL format
- `VALIDATION_MISSING_FIELDS`: Required fields missing

---

## 8. Webhook Integration

### 8.1 Click Counter Webhook

#### Endpoint
```
POST /ClickCounter
```

#### Purpose
Tracks global usage statistics without storing personal data.

#### Request Format
```json
{
  "source_domain": "example.com",
  "page": "linkaura.blankburn.online",
  "donor": false,
  "usage": "1",
  "timestamp": "2024-12-01T10:00:00Z"
}
```

#### Response Format
```json
{
  "count": 15000,
  "ClickCounter": 15000,
  "status": "success"
}
```

---

## 9. Data Privacy

### 9.1 Data Collection
- **Minimal Collection**: Only necessary data
- **No Personal Data**: No user identification
- **Anonymous Usage**: Global counters only
- **Local Storage**: User preferences only

### 9.2 Data Processing
- **URL Hashing**: Domain hashing for privacy
- **No Logging**: No request logging
- **Secure Transmission**: HTTPS only
- **Token Expiration**: Short-lived tokens

---

## 10. Testing

### 10.1 Test Endpoints

#### Health Check
```
GET /health
```

#### Test URL
```
POST /test
{
  "url": "https://httpbin.org/get"
}
```

### 10.2 Mock Responses

#### Safety Check Mock
```json
{
  "verdict": "safe",
  "confidence": 95,
  "threat_score": 5,
  "reasons": ["Test response"],
  "timestamp": "2024-12-01T10:00:00Z"
}
```

---

## 11. Monitoring

### 11.1 Metrics
- **Request Count**: Total API requests
- **Error Rate**: Failed request percentage
- **Response Time**: Average response time
- **Usage by Tier**: Requests per user tier

### 11.2 Alerts
- **High Error Rate**: >5% error rate
- **Slow Response**: >5 second response time
- **Rate Limit Breach**: Unusual usage patterns
- **API Downtime**: External API failures

---

*This API documentation provides comprehensive details about all external integrations and API endpoints used by LinkAura. For implementation examples, refer to the source code in `index.html` and `worker.js`.*
