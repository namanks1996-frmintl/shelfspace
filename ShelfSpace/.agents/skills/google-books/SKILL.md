---
name: google-books
description: Use the Google Books API to search books, retrieve volume details, look up by ISBN/barcode, manage bookshelves, and store/sync book data to any database. Not limited to a single use case — covers all Google Books API capabilities.
---

# Google Books API Skill

## Overview
The Google Books API (v1) is a free REST API for searching and accessing book metadata from Google's database of millions of scanned and indexed books. It does **not** require a pre-built MCP — use the `read_url_content` tool or `fetch` in Edge Functions / server code to call it directly.

**Base URL**: `https://www.googleapis.com/books/v1`

## Authentication

### Public Data (no user login needed)
Append your API key to any request:
```
https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=YOUR_API_KEY
```
- Get a key at [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
- Quota: 1,000 requests/day free; can be increased

### User Data (bookshelves, library)
Requires **OAuth 2.0** — use Google Sign-In / OAuth flow. Send an `Authorization: Bearer <token>` header.

---

## Endpoints

### 1. Search Volumes (Books)
```
GET /volumes?q={query}&key={API_KEY}
```

**Required:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search query |

**Search Query Keywords:**

| Keyword | Example | Effect |
|---------|---------|--------|
| `intitle:` | `intitle:harry potter` | Match only in title |
| `inauthor:` | `inauthor:rowling` | Match only in author |
| `inpublisher:` | `inpublisher:scholastic` | Match only in publisher |
| `subject:` | `subject:fantasy` | Match in category/genre |
| `isbn:` | `isbn:9780439708180` | Lookup by ISBN-10 or ISBN-13 |
| `lccn:` | `lccn:2001379260` | Library of Congress number |
| `oclc:` | `oclc:ocm50079549` | OCLC number |

**Optional Parameters:**

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `maxResults` | 1–40 | 10 | Number of results to return |
| `startIndex` | 0+ | 0 | Pagination offset |
| `orderBy` | `relevance`, `newest` | `relevance` | Sort order |
| `filter` | `ebooks`, `free-ebooks`, `full`, `paid-ebooks`, `partial` | — | Filter result type |
| `printType` | `all`, `books`, `magazines` | `all` | Restrict by print type |
| `projection` | `full`, `lite` | `full` | Response field detail level |
| `langRestrict` | ISO 639-1 code | — | e.g. `en`, `fr`, `de` |
| `download` | `epub` | — | Filter by download availability |

**Example: Search by ISBN (barcode scan)**
```
GET https://www.googleapis.com/books/v1/volumes?q=isbn:9780439023481&key=API_KEY
```

**Example: Full-text search with filters**
```
GET https://www.googleapis.com/books/v1/volumes?q=intitle:dune+inauthor:herbert&maxResults=5&orderBy=relevance&key=API_KEY
```

---

### 2. Get a Specific Volume
```
GET /volumes/{volumeId}?key={API_KEY}
```
- `volumeId` is the `id` field from a search result (e.g. `zyTCAlFPjgYC`)
- Returns the full `Volume` resource

**Example:**
```
GET https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC?key=API_KEY
```

---

### 3. List My Bookshelves (OAuth required)
```
GET /mylibrary/bookshelves
Authorization: Bearer {token}
```

**Built-in Shelf IDs:**
| ID | Name |
|----|------|
| 0 | Favorites |
| 2 | To Read |
| 3 | Reading Now |
| 4 | Have Read |
| 7 | Purchased |
| 8 | Recently Viewed |
| 9 | My eBooks |

---

### 4. Volumes on a Shelf (OAuth required)
```
GET /mylibrary/bookshelves/{shelfId}/volumes
Authorization: Bearer {token}
```

---

### 5. Add Volume to Shelf (OAuth required)
```
POST /mylibrary/bookshelves/{shelfId}/addVolume?volumeId={volumeId}
Authorization: Bearer {token}
```

---

## Response Shape – Volume Object

```json
{
  "id": "zyTCAlFPjgYC",
  "volumeInfo": {
    "title": "The Hunger Games",
    "subtitle": "Book 1",
    "authors": ["Suzanne Collins"],
    "publisher": "Scholastic Inc.",
    "publishedDate": "2008-09-01",
    "description": "...",
    "industryIdentifiers": [
      { "type": "ISBN_10", "identifier": "0439023483" },
      { "type": "ISBN_13", "identifier": "9780439023481" }
    ],
    "pageCount": 374,
    "categories": ["Juvenile Fiction"],
    "averageRating": 4.5,
    "ratingsCount": 281,
    "language": "en",
    "imageLinks": {
      "thumbnail": "http://books.google.com/books/content?id=...&zoom=1",
      "smallThumbnail": "http://books.google.com/books/content?id=...&zoom=5"
    }
  },
  "saleInfo": {
    "country": "US",
    "saleability": "NOT_FOR_SALE",
    "isEbook": false,
    "listPrice": { "amount": 12.99, "currencyCode": "USD" },
    "retailPrice": { "amount": 9.99, "currencyCode": "USD" }
  },
  "accessInfo": {
    "viewability": "PARTIAL",
    "epub": { "isAvailable": false },
    "pdf": { "isAvailable": false },
    "publicDomain": false
  }
}
```

---

## Implementation Patterns

### Pattern 1: Search by ISBN (Barcode Scan)
When a user scans a barcode, look up by ISBN-13 or ISBN-10:
```javascript
async function lookupByISBN(isbn) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.items?.length) return null;

  const book = data.items[0].volumeInfo;
  return normalizeBook(data.items[0]);
}
```

### Pattern 2: Normalize API Response to DB Schema
Always normalize before storing to handle missing fields gracefully:
```javascript
function normalizeBook(volume) {
  const v = volume.volumeInfo;
  const isbn13 = v.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier;
  const isbn10 = v.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier;

  return {
    google_volume_id: volume.id,
    title: v.title || 'Unknown Title',
    subtitle: v.subtitle || null,
    authors: v.authors || [],             // store as array
    publisher: v.publisher || null,
    published_date: v.publishedDate || null,
    description: v.description || null,
    isbn_13: isbn13 || null,
    isbn_10: isbn10 || null,
    page_count: v.pageCount || null,
    categories: v.categories || [],       // store as array
    language: v.language || null,
    average_rating: v.averageRating || null,
    ratings_count: v.ratingsCount || null,
    thumbnail_url: v.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
    thumbnail_small_url: v.imageLinks?.smallThumbnail?.replace('http://', 'https://') || null,
    is_ebook: volume.saleInfo?.isEbook || false,
    preview_link: v.previewLink || null,
    info_link: v.infoLink || null,
  };
}
```

> **Tip**: Always replace `http://` with `https://` in image URLs — Google Books serves thumbnails on HTTP by default.

### Pattern 3: Paginated Search
```javascript
async function searchBooks(query, page = 0, pageSize = 20) {
  const params = new URLSearchParams({
    q: query,
    startIndex: page * pageSize,
    maxResults: Math.min(pageSize, 40),
    orderBy: 'relevance',
    key: API_KEY,
  });

  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
  const data = await res.json();

  return {
    total: data.totalItems || 0,
    books: (data.items || []).map(normalizeBook),
    nextPage: data.items?.length === pageSize ? page + 1 : null,
  };
}
```

### Pattern 4: Store to Supabase
```javascript
async function searchAndStore(isbn, supabaseClient) {
  // 1. Check if already in DB
  const { data: existing } = await supabaseClient
    .from('books')
    .select('id')
    .eq('isbn_13', isbn)
    .single();

  if (existing) return existing;

  // 2. Fetch from Google Books
  const book = await lookupByISBN(isbn);
  if (!book) throw new Error('Book not found');

  // 3. Upsert (handles race conditions)
  const { data, error } = await supabaseClient
    .from('books')
    .upsert(book, { onConflict: 'isbn_13' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Pattern 5: Supabase Edge Function for Book Lookup
Deploy as a server-side Edge Function to keep API key secret:
```typescript
// supabase/functions/books-lookup/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GOOGLE_BOOKS_KEY = Deno.env.get("GOOGLE_BOOKS_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const { isbn, query, page = 0 } = await req.json();
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let apiUrl: string;
  if (isbn) {
    apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_KEY}`;
  } else if (query) {
    apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&startIndex=${page * 20}&key=${GOOGLE_BOOKS_KEY}`;
  } else {
    return new Response(JSON.stringify({ error: "isbn or query required" }), { status: 400 });
  }

  const res = await fetch(apiUrl);
  const data = await res.json();
  const books = (data.items || []).map(normalizeBook);

  // Optionally upsert all results into books table
  if (books.length > 0) {
    await supabase.from('books').upsert(books, { onConflict: 'google_volume_id', ignoreDuplicates: true });
  }

  return new Response(JSON.stringify({ books, total: data.totalItems || 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Pattern 6: Client-side React Hook
```typescript
function useBookSearch(query: string) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/books?query=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setBooks(data.books))
      .catch(err => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => setLoading(false));

    return () => controller.abort(); // cancel in-flight requests on re-render
  }, [query]);

  return { books, loading };
}
```

---

## Suggested Database Schema

```sql
CREATE TABLE books (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_volume_id  TEXT UNIQUE,
  isbn_13           TEXT UNIQUE,
  isbn_10           TEXT,
  title             TEXT NOT NULL,
  subtitle          TEXT,
  authors           TEXT[],          -- PostgreSQL array
  publisher         TEXT,
  published_date    TEXT,            -- Keep as text; format varies e.g. "2008", "2008-09"
  description       TEXT,
  page_count        INT,
  categories        TEXT[],
  language          TEXT,
  average_rating    NUMERIC(2,1),
  ratings_count     INT,
  thumbnail_url     TEXT,
  thumbnail_small_url TEXT,
  is_ebook          BOOLEAN DEFAULT FALSE,
  preview_link      TEXT,
  info_link         TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- For user-specific reading lists / shelves
CREATE TABLE user_books (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id    UUID REFERENCES books(id) ON DELETE CASCADE,
  status     TEXT CHECK (status IN ('want_to_read', 'reading', 'read', 'did_not_finish')),
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  review     TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, book_id)
);
```

---

## Error Handling

| Scenario | Cause | Fix |
|----------|-------|-----|
| `totalItems: 0` | No results found | Try alternate ISBN (ISBN-10 vs ISBN-13) or fuzzy title search |
| `403 forbidden` | Invalid/missing API key | Check key is enabled for Books API |
| `429 Too Many Requests` | Rate limit exceeded | Implement exponential backoff; cache results |
| `items` is undefined | API key missing or 0 results | Always check `data.items?.length > 0` before accessing |
| Image URLs broken | HTTP vs HTTPS | Replace `http://` → `https://` in all image URLs |

---

## Important Limits & Notes
- **Quota**: 1,000 free requests/day per API key; 40 max results per request
- **Coverage**: ~40 million books, strongest for books published after 2000
- **ISBN lookup**: Most reliable with ISBN-13; fallback to ISBN-10 if no results
- **No private key client-side**: Always call from a server, Edge Function, or BFF to protect the API key
- **Thumbnail HTTPS**: Google serves images on HTTP — always convert to HTTPS for modern browsers
- **`publishedDate` format varies**: Could be `"2008"`, `"2008-09"`, or `"2008-09-01"` — store as TEXT, parse carefully
- **`authors` may be undefined**: Not all books have author metadata — always default to `[]`
