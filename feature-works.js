// ========================================
// FEATURE WORKS - Under Construction
// ========================================
// This file contains features that are still under development
// and not yet ready for production use.

// Domain Age Check Feature
window.checkDomainAge = async function(domain) {
  const domainAgeStatusEl = document.getElementById("domainAgeStatus");
  const domainAgeIconEl = document.getElementById("domainAgeIcon");
  const domainAgeTextEl = document.getElementById("domainAgeText");

  if (!domainAgeStatusEl) return;

  try {
    // Clean domain and check suspicious TLDs first
    const cleanDomain = domain.toLowerCase().replace('www.', '');
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.work', '.icu'];

    const hasSuspiciousTLD = suspiciousTLDs.some(tld => cleanDomain.endsWith(tld));
    if (hasSuspiciousTLD) {
      domainAgeStatusEl.classList.remove("hidden");
      domainAgeIconEl.textContent = "warning";
      domainAgeIconEl.className = "material-symbols-outlined text-base text-yellow-500 dark:text-yellow-400";
      domainAgeTextEl.textContent = "Suspicious TLD - exercise caution";
      return;
    }

    // Use LinkAura API for domain age check (avoids CORS issues)
    try {
      const result = await callLinkAuraAPI("domain-age", { 
        domain: cleanDomain,
        hasSuspiciousTLD: hasSuspiciousTLD
      });

      if (result && !result.error && !result.offline && result.creationDate) {
        const creationDate = new Date(result.creationDate);
        const today = new Date();
        const diffTime = Math.abs(today - creationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        domainAgeStatusEl.classList.remove("hidden");

        if (diffDays <= 1) {
          domainAgeIconEl.textContent = "warning";
          domainAgeIconEl.className = "material-symbols-outlined text-base text-red-500 dark:text-red-400";
          domainAgeTextEl.textContent = `Domain registered today - very suspicious`;
        } else if (diffDays <= 7) {
          domainAgeIconEl.textContent = "warning";
          domainAgeIconEl.className = "material-symbols-outlined text-base text-orange-500 dark:text-orange-400";
          domainAgeTextEl.textContent = `Domain registered ${diffDays} days ago - high caution`;
        } else if (diffDays <= 30) {
          domainAgeIconEl.textContent = "warning";
          domainAgeIconEl.className = "material-symbols-outlined text-base text-yellow-500 dark:text-yellow-400";
          domainAgeTextEl.textContent = `Recently registered (${diffDays} days ago)`;
        } else {
          domainAgeIconEl.textContent = "verified";
          domainAgeIconEl.className = "material-symbols-outlined text-base text-green-500 dark:text-green-400";
          domainAgeTextEl.textContent = `Established domain (${Math.floor(diffDays/30)} months old)`;
        }
        return;
      } else if (result && result.error === "No API options selected") {
        // Domain age checkbox is not selected, skip API call
        console.log('🔒 Domain age check skipped - checkbox not selected');
        return;
      }
    } catch (apiError) {
      console.warn("Domain age API check failed:", apiError);
      // Fall back to local TLD check only
    }

    // If no API worked, show neutral message
    domainAgeStatusEl.classList.remove("hidden");
    domainAgeIconEl.textContent = "info";
    domainAgeIconEl.className = "material-symbols-outlined text-base text-blue-500 dark:text-blue-400";
    domainAgeTextEl.textContent = "Domain age unknown - verify manually";

  } catch (error) {
    // Network or other error
    domainAgeStatusEl.classList.remove("hidden");
    domainAgeIconEl.textContent = "info";
    domainAgeIconEl.className = "material-symbols-outlined text-base text-blue-500 dark:text-blue-400";
    domainAgeTextEl.textContent = "Domain age check failed";
  }
};

// Malware Check Feature
window.checkMalware = async function(url) {
  const malwareStatusEl = document.getElementById("malwareStatus");
  const malwareIconEl = document.getElementById("malwareIcon");
  const malwareTextEl = document.getElementById("malwareText");

  if (!malwareStatusEl) return;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase().replace('www.', '');
    const subdomain = urlObj.hostname.toLowerCase();
    const mainDomain = domain.split('.').slice(-2).join('.');

    // Check for suspicious patterns locally
    const suspiciousSubdomains = ['secure', 'account', 'login', 'verify', 'update', 'confirm', 'support', 'help', 'admin', 'service'];
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.work', '.icu'];
    const numericPattern = /^\d+\.\d+\.\d+\.\d+$/;

    const hasSuspiciousSubdomain = suspiciousSubdomains.some(sub => subdomain.includes(sub));
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => domain.endsWith(tld));
    const hasNumericPattern = numericPattern.test(domain);

    if (hasSuspiciousSubdomain || hasSuspiciousTLD || hasNumericPattern) {
      malwareStatusEl.classList.remove("hidden");
      malwareIconEl.textContent = "warning";
      malwareIconEl.className = "material-symbols-outlined text-base text-orange-500 dark:text-orange-400";
      malwareTextEl.textContent = "Suspicious patterns detected - exercise caution";
      return;
    }

    let threatsFound = false;
    let checksPerformed = 0;

    try {
      const result = await callLinkAuraAPI("malware-check", {
        url: url,
        domain: domain,
        subdomain: subdomain,
        mainDomain: mainDomain,
        hasSuspiciousSubdomain: hasSuspiciousSubdomain,
        hasSuspiciousTLD: hasSuspiciousTLD,
        hasNumericPattern: hasNumericPattern
      });
      checksPerformed = 1;
      if (result && !result.error && !result.offline) {
        if (result.threatsFound || result.malicious || result.verdict === 'malicious') {
          threatsFound = true;
        }
      }
    } catch (apiError) {
      console.warn("Malware API check failed:", apiError);
    }

    malwareStatusEl.classList.remove("hidden");

    if (threatsFound) {
      malwareIconEl.textContent = "dangerous";
      malwareIconEl.className = "material-symbols-outlined text-base text-red-500 dark:text-red-400";
      malwareTextEl.textContent = "Malware detected - avoid this link";
    } else if (checksPerformed > 0) {
      malwareIconEl.textContent = "verified";
      malwareIconEl.className = "material-symbols-outlined text-base text-green-500 dark:text-green-400";
      malwareTextEl.textContent = "No malware detected";
    } else {
      malwareIconEl.textContent = "info";
      malwareIconEl.className = "material-symbols-outlined text-base text-blue-500 dark:text-blue-400";
      malwareTextEl.textContent = "Malware check unavailable";
    }

  } catch (error) {
    malwareStatusEl.classList.remove("hidden");
    malwareIconEl.textContent = "info";
    malwareIconEl.className = "material-symbols-outlined text-base text-blue-500 dark:text-blue-400";
    malwareTextEl.textContent = "Malware check failed";
  }
};

console.log("🔧 Feature Works loaded - Domain Age and Malware Check features available for development");
