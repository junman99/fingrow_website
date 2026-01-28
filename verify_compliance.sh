#!/bin/bash

echo "🔍 APP STORE COMPLIANCE VERIFICATION CHECKLIST"
echo "=============================================="
echo ""

echo "✅ PRIVACY POLICY UPDATES:"
echo "  - Last Updated: January 28, 2026"
echo "  - Added: OpenAI (ChatGPT API)"
echo "  - Added: Yahoo Finance"
echo "  - Fixed: Encryption claim (iOS system-level security)"
echo ""

echo "📋 MANUAL VERIFICATION CHECKLIST:"
echo ""
echo "1. ⬜ Privacy Policy URL Works:"
echo "   → Open: https://fingrow.app/privacy"
echo "   → Check: OpenAI and Yahoo Finance listed"
echo ""

echo "2. ⬜ App Description Has Links (App Store Connect):"
echo "   → Go to: App Store Connect → MonifyAI → 1.0.2"
echo "   → Scroll to: Description field (bottom)"
echo "   → Add this text:"
echo ""
cat << 'EOFTEXT'
━━━━━━━━━━━━━━━━━━━━

SUBSCRIPTION DETAILS

• MonifyAI Pro: $4.99/month (auto-renewable)
• MonifyAI Premium: $9.99/month (auto-renewable)

Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. Manage your subscription in iOS Settings.

Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
Privacy Policy: https://fingrow.app/privacy
EOFTEXT
echo ""

echo "3. ⬜ Privacy Policy URL Field (App Store Connect):"
echo "   → Go to: App Store Connect → MonifyAI → App Information"
echo "   → Find: Privacy Policy URL field"
echo "   → Enter: https://fingrow.app/privacy"
echo ""

echo "4. ⬜ Test In-App Links (Build & Run on Device):"
echo "   → Open Paywall screen in app"
echo "   → Tap 'Terms' → Should open Safari with Apple EULA"
echo "   → Tap 'Privacy' → Should open Safari with fingrow.app/privacy"
echo ""

echo "5. ⬜ Deploy Privacy Policy:"
echo "   → Commit changes: git add privacy.html && git commit -m 'Update privacy policy'"
echo "   → Push to hosting: git push origin main"
echo "   → Verify live: curl -I https://fingrow.app/privacy | grep '200 OK'"
echo ""

echo "═══════════════════════════════════════════"
echo "✅ After all checked, rebuild and submit!"
echo "═══════════════════════════════════════════"
