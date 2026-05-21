# Visitor Counter Setup

This site includes a cloud-backed visitor counter using a simple Express API and Supabase.

## Setup

1. Create a Supabase project at https://supabase.com.
2. In the SQL editor, create the counter table:

```sql
create table visitor_counts (
  id text primary key,
  count bigint not null default 0
);

insert into visitor_counts (id, count)
values ('global', 0)
on conflict do nothing;
```

3. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

4. Install dependencies:

```bash
npm install
```

5. Start the server:

```bash
npm start
```

6. Open `http://localhost:3000` in your browser.

## How it works

- `server.js` serves the static site and exposes a REST API.
- `counter.js` calls `POST /api/visit` on page load.
- The API updates a Supabase table and returns the current visitor count.

## Notes

- Do not commit your `.env` file.
- Use the Supabase service role key only on the server.
