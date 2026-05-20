insert into public.reviews (
  id,
  external_review_id,
  place_id,
  author_name,
  rating,
  content,
  status,
  reviewed_at
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'sample-review-001',
    'ChIJN1t_tDeuEmsRUsoyG83frY4',
    'Minh Anh',
    3,
    'Phong kha sach nhung check-in hoi cham, minh phai doi gan 20 phut.',
    'Pending',
    '2026-05-20T08:30:00.000Z'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'sample-review-002',
    'ChIJN1t_tDeuEmsRUsoyG83frY4',
    'Quang Huy',
    5,
    'Nhan vien than thien, vi tri thuan tien, bua sang on so voi gia.',
    'Pending',
    '2026-05-20T07:10:00.000Z'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'sample-review-003',
    'ChIJN1t_tDeuEmsRUsoyG83frY4',
    'Linh Tran',
    2,
    'Phong hoi ban va dieu hoa keu to vao ban dem. Mong khach san cai thien.',
    'Pending',
    '2026-05-19T18:45:00.000Z'
  )
on conflict (id) do update set
  external_review_id = excluded.external_review_id,
  place_id = excluded.place_id,
  author_name = excluded.author_name,
  rating = excluded.rating,
  content = excluded.content,
  status = excluded.status,
  reviewed_at = excluded.reviewed_at;
