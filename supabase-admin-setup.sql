-- Supabase Dashboard > SQL Editor > New query > paste all > Run.
-- Content is public-readable, but only the named authenticated admin can write.
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "Ndrexan content public read" on public.site_content;
drop policy if exists "Ndrexan admin insert" on public.site_content;
drop policy if exists "Ndrexan admin update" on public.site_content;
drop policy if exists "Ndrexan admin delete" on public.site_content;

create policy "Ndrexan content public read"
on public.site_content for select to anon, authenticated using (true);
create policy "Ndrexan admin insert"
on public.site_content for insert to authenticated
with check ((auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com');
create policy "Ndrexan admin update"
on public.site_content for update to authenticated
using ((auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com')
with check ((auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com');
create policy "Ndrexan admin delete"
on public.site_content for delete to authenticated
using ((auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com');

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

insert into public.site_content (id, content)
values ('main', '{
 "siteTitle":"Ndrexan",
 "signature":"creative by nature.",
 "statement":"Desainer, fotografer, dan pembuat website.",
 "intro":"Saya Andre Arshavin, berasal dari Tangerang Selatan dan bersekolah di SMKN 4 Tangsel jurusan DKV. Skill saya fotografi, desain, dan pembuatan website.",
 "about":"Saya mulai suka dalam bidang editing, desain, maupun build web karena satu orang yang selalu memotivasi saya untuk terus mengasah kemampuan saya, dan karena itu saya juga memiliki banyak pengalaman.",
 "contactNote":"Terbuka untuk kolaborasi, proyek kreatif, dan obrolan seputar desain atau website.",
 "email":"andrearshavinkece73@gmail.com"
}'::jsonb)
on conflict (id) do nothing;


-- Storage bucket for portfolio photos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-photos', 'site-photos', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif'];

drop policy if exists "Ndrexan photos public read" on storage.objects;
drop policy if exists "Ndrexan admin upload photos" on storage.objects;
drop policy if exists "Ndrexan admin update photos" on storage.objects;
drop policy if exists "Ndrexan admin delete photos" on storage.objects;

create policy "Ndrexan photos public read"
on storage.objects for select to public
using (bucket_id = 'site-photos');

create policy "Ndrexan admin upload photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'site-photos'
  and (auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com'
);

create policy "Ndrexan admin update photos"
on storage.objects for update to authenticated
using (
  bucket_id = 'site-photos'
  and (auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com'
)
with check (
  bucket_id = 'site-photos'
  and (auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com'
);

create policy "Ndrexan admin delete photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'site-photos'
  and (auth.jwt() ->> 'email') = 'andrearshavinkece73@gmail.com'
);
