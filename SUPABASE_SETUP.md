## Supabase setup (required for Admin + Reservations + Image Uploads)

This project uses:
- **Rooms table**: `Aura-basic-rooms`
- **Reservations table**: `Aura-basic-reservations` (you will create this)
- **Storage bucket**: `Aura-basic-room-images` (you will create this)
- **Admin access**: Supabase Auth + RLS (Row Level Security)

> Important: the frontend will work without RLS in development, but for a real hotel app you **must** enable RLS and apply the policies below.

---

## 1) Create the reservations table

Run this in **Supabase SQL Editor**:

```sql
create table if not exists public."Aura-basic-reservations" (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  guest_name text not null,
  guest_email text not null,
  check_in date not null,
  check_out date not null,
  status text not null default 'pending' check (status in ('pending','booked','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aura_basic_reservations_room_id_idx
  on public."Aura-basic-reservations"(room_id);

create index if not exists aura_basic_reservations_status_idx
  on public."Aura-basic-reservations"(status);
```

Optional (recommended): keep `updated_at` current:

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_on_aura_basic_reservations on public."Aura-basic-reservations";
create trigger set_updated_at_on_aura_basic_reservations
before update on public."Aura-basic-reservations"
for each row execute function public.set_updated_at();
```

---

## 2) Create an `admins` table (who can access the Admin UI)

```sql
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
```

After you create an admin user in **Authentication → Users**, insert their `user_id` here:

```sql
insert into public.admins (user_id) values ('<PASTE_ADMIN_AUTH_USER_ID_HERE>');
```

---

## 3) Enable RLS and add policies

### Rooms table (`Aura-basic-rooms`)

Enable RLS:

```sql
alter table public."Aura-basic-rooms" enable row level security;
```

Policies (public can read, only admins can write):

```sql
drop policy if exists "Rooms are readable by everyone" on public."Aura-basic-rooms";
create policy "Rooms are readable by everyone"
on public."Aura-basic-rooms"
for select
to anon, authenticated
using (true);

drop policy if exists "Rooms writable by admins" on public."Aura-basic-rooms";
create policy "Rooms writable by admins"
on public."Aura-basic-rooms"
for all
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
```

### Reservations table (`Aura-basic-reservations`)

Enable RLS:

```sql
alter table public."Aura-basic-reservations" enable row level security;
```

Policies:
- Anyone can **insert** a pending reservation (customer inquiry)
- Only admins can **read/update/delete**

```sql
drop policy if exists "Anyone can create reservation inquiries" on public."Aura-basic-reservations";
create policy "Anyone can create reservation inquiries"
on public."Aura-basic-reservations"
for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Admins can read reservations" on public."Aura-basic-reservations";
create policy "Admins can read reservations"
on public."Aura-basic-reservations"
for select
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can update reservations" on public."Aura-basic-reservations";
create policy "Admins can update reservations"
on public."Aura-basic-reservations"
for update
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins can delete reservations" on public."Aura-basic-reservations";
create policy "Admins can delete reservations"
on public."Aura-basic-reservations"
for delete
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
```

---

## 4) Create the Storage bucket for room images

In **Storage → Buckets**, create a bucket:
- Name: `Aura-basic-room-images`
- Public: **ON** (simplest)

If you prefer private, you’ll need signed URLs; this app assumes public image URLs for fast rendering.

### RLS for Storage (public read, admin write)

Supabase storage policies apply to `storage.objects`.

```sql
-- Public read of objects in Aura-basic-room-images
drop policy if exists "Public read room images" on storage.objects;
create policy "Public read room images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'Aura-basic-room-images');

-- Admin can upload/update/delete in Aura-basic-room-images
drop policy if exists "Admin manage room images" on storage.objects;
create policy "Admin manage room images"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'Aura-basic-room-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'Aura-basic-room-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);
```

