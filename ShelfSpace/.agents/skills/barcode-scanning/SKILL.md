---
name: barcode-scanning
description: Add camera-based barcode/ISBN scanning to a web app using html5-qrcode. Covers library setup, React component integration, ISBN extraction, and chaining into Google Books API lookup. Works on mobile and desktop browsers.
---

# Barcode Scanning Skill

## Overview
Barcode scanning is the primary book-entry flow in ShelfSpace — the user points their camera at a book's barcode and the app looks it up automatically. This skill covers the full pipeline:

```
Camera → Scan barcode → Extract ISBN → Google Books API → Show book metadata
```

**Library**: [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) — cross-browser, works on iOS Safari, Android Chrome, and desktop.
**Alternative**: The native [`BarcodeDetector` API](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector) — skip this for now, it's not supported on iOS Safari.

---

## Installation

```bash
npm install html5-qrcode
```

---

## Supported Barcode Formats for Books
| Format | When used |
|--------|-----------|
| `EAN_13` | Standard ISBN-13 (most books published after 2007) |
| `EAN_8` | Rare, small books |
| `UPC_A` | Older US books (ISBN-10 derived) |
| `CODE_128` | Some library/retailer barcodes |
| `QR_CODE` | Optional — useful for QR-based book sharing features |

---

## Core React Component

```tsx
// components/BarcodeScanner.tsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface Props {
  onScan: (isbn: string) => void;   // called with the detected ISBN
  onError?: (error: string) => void;
}

const BOOK_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.CODE_128,
];

export function BarcodeScanner({ onScan, onError }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isActive, setIsActive] = useState(false);

  const start = async () => {
    const scanner = new Html5Qrcode("barcode-scanner-container", { verbose: false });
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },      // rear camera on mobile
        { fps: 10, qrbox: { width: 280, height: 160 } },
        (decodedText) => {
          // Only pass ISBN-like values (EAN-13 starts with 978/979 for books)
          const cleaned = decodedText.replace(/[^0-9X]/g, "");
          if (isISBN(cleaned)) {
            stop();
            onScan(cleaned);
          }
        },
        () => {} // suppress per-frame "not found" errors
      );
      setIsActive(true);
    } catch (err) {
      onError?.(String(err));
    }
  };

  const stop = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
    setIsActive(false);
  };

  useEffect(() => {
    start();
    return () => { stop(); }; // clean up on unmount
  }, []);

  return (
    <div>
      <div id="barcode-scanner-container" style={{ width: "100%" }} />
      {isActive && (
        <button onClick={stop}>Cancel</button>
      )}
    </div>
  );
}

function isISBN(code: string): boolean {
  return (
    (code.length === 13 && (code.startsWith("978") || code.startsWith("979"))) ||
    code.length === 10
  );
}
```

---

## Full Scan → Lookup → Store Flow

```tsx
// pages/AddBook.tsx
import { useState } from "react";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export function AddBookPage() {
  const [scanning, setScanning] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (isbn: string) => {
    setScanning(false);
    setLoading(true);
    setError(null);

    try {
      // Call your server-side Edge Function or API route (keeps API key safe)
      const res = await fetch(`/api/books/lookup?isbn=${isbn}`);
      if (!res.ok) throw new Error("Book not found");
      const data = await res.json();
      setBook(data.book);
    } catch (err) {
      setError("Could not find this book. Try searching by title instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!scanning && !book && (
        <button onClick={() => setScanning(true)}>Scan Barcode</button>
      )}

      {scanning && (
        <BarcodeScanner
          onScan={handleScan}
          onError={(e) => { setError(e); setScanning(false); }}
        />
      )}

      {loading && <p>Looking up book...</p>}
      {error && <p>{error}</p>}
      {book && <BookPreview book={book} />}
    </div>
  );
}
```

---

## Supabase Edge Function for ISBN Lookup

Keep the Google Books API key server-side:

```typescript
// supabase/functions/books-lookup/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GOOGLE_BOOKS_KEY = Deno.env.get("GOOGLE_BOOKS_API_KEY")!;

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const isbn = url.searchParams.get("isbn");
  const query = url.searchParams.get("query");

  if (!isbn && !query) {
    return new Response(JSON.stringify({ error: "isbn or query required" }), { status: 400 });
  }

  const q = isbn ? `isbn:${isbn}` : encodeURIComponent(query!);
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5&key=${GOOGLE_BOOKS_KEY}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  if (!data.items?.length) {
    return new Response(JSON.stringify({ book: null }), { status: 404 });
  }

  const v = data.items[0].volumeInfo;
  const isbn13 = v.industryIdentifiers?.find((i: any) => i.type === "ISBN_13")?.identifier;
  const isbn10 = v.industryIdentifiers?.find((i: any) => i.type === "ISBN_10")?.identifier;

  const book = {
    google_volume_id: data.items[0].id,
    title: v.title,
    authors: v.authors || [],
    publisher: v.publisher || null,
    published_date: v.publishedDate || null,
    description: v.description || null,
    isbn_13: isbn13 || null,
    isbn_10: isbn10 || null,
    page_count: v.pageCount || null,
    categories: v.categories || [],
    thumbnail_url: v.imageLinks?.thumbnail?.replace("http://", "https://") || null,
    average_rating: v.averageRating || null,
  };

  return new Response(JSON.stringify({ book, total: data.totalItems }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

## Camera Permission Handling

Always request camera access gracefully:

```tsx
async function checkCameraPermission(): Promise<"granted" | "denied" | "prompt"> {
  if (!navigator.permissions) return "prompt"; // iOS Safari fallback
  const result = await navigator.permissions.query({ name: "camera" as PermissionName });
  return result.state;
}
```

Show a clear explanation before triggering the camera permission prompt — iOS in particular will deny silently if not given context.

---

## UX Best Practices for Book Scanning
- **Always provide a manual search fallback** — not all books have scannable barcodes (old/damaged)
- **Show a viewfinder overlay** — a rectangular guide box helps users align the barcode
- **Rear camera first** — always start with `facingMode: "environment"` on mobile
- **Stop the stream on unmount** — always call `scanner.stop()` to release the camera
- **Debounce lookups** — `html5-qrcode` fires `onScanSuccess` rapidly; stop scanning immediately on first valid hit
- **ISBN validation** — verify the code is 10 or 13 digits AND starts with 978/979 before calling the API

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Camera not starting on iOS | Permission not granted or HTTP | Must use HTTPS; iOS requires user gesture to start camera |
| `html5-qrcode` element not found | DOM element missing at mount time | Ensure the container `div` is rendered before calling `start()` |
| Scanning fires multiple times | Stream keeps running after hit | Call `stop()` inside `onScanSuccess` immediately |
| Barcode detected but not ISBN | Non-book barcode scanned | Validate with `isISBN()` before calling Google Books API |
| Black screen on Android | Wrong `facingMode` | Try `{ exact: "environment" }` first, fall back to just `"environment"` |
