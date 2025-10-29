# LinkAura - Privacy-Focused URL Cleaner & Security Tool

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/your-username/linkaura)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-linkaura.blankburn.online-orange.svg)](https://linkaura.blankburn.online)
[![No Tracking](https://img.shields.io/badge/privacy-no%20tracking-brightgreen.svg)](#privacy)

A powerful, privacy-focused tool that removes tracking parameters from URLs while providing comprehensive security analysis. LinkAura helps you maintain privacy by cleaning URLs of tracking elements and offers advanced security assessments.

## ✨ Features

### 🔒 Privacy Protection
- **Remove Tracking Parameters**: Eliminates utm_*, fbclid, gclid, and other tracking elements
- **No User Tracking**: We don't track you or show ads
- **Local Processing**: Most features run entirely in your browser
- **Privacy Mode**: Complete offline mode for sensitive URLs

### 🛡️ Security Analysis
- **Safety API**: Community-verified URL safety checking
- **SSL Certificate Validation**: Certificate health and security grading
- **AI Website Security Scan**: Comprehensive AI-powered security analysis
- **WHOIS Check**: Domain verification via DNS with name servers, SOA records, and admin contact information
- **Local Security Features**: URL structure analysis, expiration checking, social media detection
- **Language Detection**: Automatic detection of web page language
- **Accessibility Analysis**: WCAG compliance testing and accessibility scoring

### 🚀 Advanced Features
- **Bulk URL Processing**: Clean multiple URLs at once
- **QR Code Generation**: Instant QR codes for cleaned URLs
- **Statistics Dashboard**: Track your URL cleaning activity
- **URL History**: Save and manage cleaned URLs
- **Progressive Web App**: Install as a native app

### 💎 Supporter Tiers
- **Free**: 3 API calls/day + unlimited local features
- **Coffee ($3)**: 10 API calls/day for 1 month
- **Supporter ($10)**: 50 API calls/day for 3 months  
- **Champion ($25)**: Unlimited API calls for 6 months

## 🚀 Quick Start

### Online Usage
Visit [LinkAura](https://linkaura.blankburn.online) and start cleaning URLs instantly!

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/linkaura.git
cd linkaura

# Start local server
python -m http.server 8080
# or
npx live-server --port=8080

# Open in browser
open http://localhost:8080
```

## 📖 Documentation

- **[User Guide](USER_GUIDE.md)** - Complete user manual
- **[API Documentation](API_DOCUMENTATION.md)** - API integration guide
- **[Technical Specification](SPECIFICATION.md)** - Technical architecture
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Developer documentation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Cloudflare Workers
- **APIs**: LinkAura API, n8n Workflows
- **Authentication**: JWT tokens
- **Storage**: LocalStorage, SessionStorage
- **Deployment**: GitHub Pages, Cloudflare

## 🔧 API Integration

### Cloudflare Worker Proxy
LinkAura uses a Cloudflare Worker as a proxy to handle CORS issues and provide unified authentication.

### External APIs
- **Safety Check**: Community database threat analysis
- **SSL Validation**: Certificate security assessment
- **WebSecScan**: AI-powered security scanning via n8n workflows
- **WHOIS Check**: DNS-based domain verification with name servers and SOA records
- **Domain Age**: WHOIS-based domain analysis
- **Malware Check**: Multi-engine malware detection
- **Language Detection**: Content language identification
- **Accessibility Analysis**: WCAG compliance testing

## 📊 Usage Statistics

- **Total URLs Cleaned**: 15,000+ and counting
- **Supported Parameters**: 50+ tracking parameter types
- **Security Checks**: 1,000+ daily security analyses
- **User Satisfaction**: 99%+ uptime

## 🔒 Privacy & Security

### What We Don't Track
- Personal information or browsing history
- URL content (processed locally)
- Location data or device information
- User behavior or preferences

### What We Store Locally
- URL cleaning history (your device only)
- User preferences and settings
- Anonymous usage statistics

### Security Features
- HTTPS encryption for all connections
- JWT token authentication
- Input validation and sanitization
- XSS protection
- Rate limiting and abuse prevention

## 🌟 Key Benefits

### For Individuals
- **Privacy Protection**: Remove tracking from shared URLs
- **Security Awareness**: Check URL safety before clicking
- **Convenience**: Clean URLs with one click
- **No Registration**: Start using immediately

### For Businesses
- **Team Security**: Safe URL sharing across teams
- **Compliance**: Meet privacy regulations
- **Productivity**: Bulk URL processing
- **Analytics**: Track URL cleaning activity

### For Developers
- **API Access**: Integrate URL cleaning into your apps
- **Open Source**: Contribute to the project
- **Documentation**: Comprehensive developer guides
- **Community**: Join our developer community

## 🚀 Getting Started

### Basic URL Cleaning
1. Paste any URL into the input field
2. Choose what parameters to remove
3. Click "Clean URL"
4. Copy, share, or generate QR code

### Security Analysis
1. Enable desired security features
2. Clean your URL as usual
3. View security analysis results
4. Take action based on findings

### Bulk Processing
1. Switch to "Bulk Processing" tab
2. Paste multiple URLs (one per line)
3. Select cleaning options
4. Process all URLs at once

## 📱 Progressive Web App

LinkAura works as a Progressive Web App (PWA):
- **Install**: Add to home screen
- **Offline**: Basic functionality works offline
- **Native Feel**: App-like experience
- **Updates**: Automatic updates

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](DEVELOPMENT_GUIDE.md) for details.

### Quick Contribution
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Community**: Thanks to all users and contributors
- **Open Source**: Built with open source technologies
- **Security Community**: For threat intelligence and safety data
- **n8n Community**: For workflow templates and automation

## 📞 Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report bugs on GitHub
- **Community**: Join our community forum
- **Email**: Contact support for technical issues

## 🔗 Links

- **Website**: [linkaura.blankburn.online](https://linkaura.blankburn.online)
- **GitHub**: [github.com/your-username/linkaura](https://github.com/your-username/linkaura)
- **Documentation**: [docs.linkaura.com](https://docs.linkaura.com)
- **Community**: [community.linkaura.com](https://community.linkaura.com)

---

**Made with ❤️ for privacy and security**

*LinkAura - Clean URLs, Secure Browsing, Privacy First*
