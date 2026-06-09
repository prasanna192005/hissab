# Hissab
### Free AI Bill Splitter App for Groups | Split Restaurant Bills Instantly

No more awkward *"bhai, tera kitna hua?"* messages in WhatsApp groups after a heavy biryani dinner, dhaba party, or a quick momo run. **Hissab** does the math in a chutki!

Just snap a photo of the bill, assign who ate what, and generate custom **UPI QR Codes** for everyone to pay instantly. Clean, simple, and styled like a classic dukaan thermal receipt.

---

## Why Hissab?

*   **Chutki mein OCR Scan**: Snap a photo of your receipt. Our Gemini AI model structures items, quantities, and prices faster than a local cutting-chai boils.
*   **Bhai-style Assignment**: Tap diner names to split items, or type naturally like: 
    > *"Amit and Priya shared the paneer tikka. Everyone had garlic naan and coke."* 
    Hissab maps it automatically!
*   **UPI QR Codes for Everyone**: Enter your UPI ID, and Hissab creates separate, exact-amount QR codes for each debtor. They scan, they pay, and your account is settled. No copy-pasting numbers.
*   **Local Tesseract OCR Option**: No internet on the highway? Switch to local Tesseract OCR to parse text completely in your browser.
*   **Dukaan Design Aesthetic**: Styled like a classic physical shop ticket receipt because digital splitters shouldn't look boring.

---

## Built With
*   **Next.js 16 (App Router)** & **React 19**
*   **Tailwind CSS v4** (Custom physical ticket variables)
*   **Google Gemini 3.1 Flash Lite** (For lightning-fast OCR & assignment parsing)
*   **Tesseract.js** (For browser-local OCR)
*   **QR Server API** (For instant UPI QR rendering)

---
*Made for groups who love splitting bills, not friendships.*

## Why I Made This

Tired of opening calculator apps after every group dinner and manually typing line items just to figure out who owes what? Existing splitters either force you to type everything by hand or make payments awkward by requiring manual UPI copy-pasting. 

I built **Hissab** to completely automate receipt math using Gemini AI and remove settlement friction. Just upload, assign, scan the custom QR, and settle up on the spot. No math, no typos, no awkward follow-ups.
