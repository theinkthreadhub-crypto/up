# Project Architectural & Design Rules — Inkthread Hub

## 1. Stitch AI Framework Directive
- **Mandatory UI/UX Standard**: ALL website UI/UX design, component styling, typography (Bodoni Moda & Hanken Grotesk), layout architecture, visual aesthetics, micro-animations, dual-image hover interactions, and frontend developments for Inkthread Hub MUST strictly use Stitch AI design principles and Stitch MCP server integration.
- **Rich Aesthetics & Visual Excellence**: Maintain high-impact glassmorphism overlays, curated color palettes (`#FBF9F9` background, `#121212` primary, `#5E5E5B` secondary), double-image hover previews, and zero generic/placeholder elements.

## 2. Centralized Single Source of Truth
- Product catalog data, stock levels, variants, images, customer reviews, and journal articles are centrally managed in `js/store.js` (`ProductsService`) and synchronized across Homepage (`index.html`), Catalog (`shop.html`), Product Details (`product.html`), The Journal (`journal.html`), and Admin Portal (`admin.html`).

## 3. Express Checkout & Payment Rules
- **PhonePe QR Code**: Official PhonePe QR Code (`images/payment_qr_phonepe.jpg`) assigned to account holder **SURYA TIWARI**.
- **Product Base Prices**: Fixed & unchanged (e.g. ₹349 for Matty Polo, ₹499 for Pet Collar, ₹749 for Sun God Tee, etc.).
- **Prepaid Payment**: Adds **+₹50 Extra Delivery Fee** (Total = Base Price + ₹50). Fully paid online via PhonePe QR.
- **Cash on Delivery (COD)**: Adds **+₹99 Extra COD Delivery Fee** (Total = Base Price + ₹99). Requires mandatory **₹99 Online Advance Deposit** via PhonePe QR to confirm dispatch.
- **Automated Dual Email Receipts**: Dispatches instant order receipts to both customer email and store administration (**theinkhthreadhub@gmail.com**).
- **Automated WhatsApp Redirection**: Formats and redirects complete order details to **6392995127**.
- **Automatic Client Receipt Screen**: Displays **"Thank You For Shopping With Inkthread Hub!"** modal with receipt summary.

## 4. Admin Portal & Security Rules
- **Access Route**: Discreet Lock icon (`🔒`) in top header; no public "Dashboard" link in main navbars.
- **Authentication**: Password protected with **`inkthread@2026`** (Username: `admin`).
- **No Forgot Password Link**: Never add a "Forgot Password" or recovery link on the admin login screen.
- **Control Center Features**: Includes Products Catalog CRUD, Journal & Blog CMS Manager, and Customer Orders Fulfillment Log.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
