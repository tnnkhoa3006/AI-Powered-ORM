import type { AiReplies, CustomerReview } from "../types";
import type { CreateReviewInput } from "../schemas";

export const demoPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4";

type SampleReviewTemplate = {
  id: string;
  authorName: string;
  rating: number;
  content: string;
};

export const sampleReviewTemplates: SampleReviewTemplate[] = [
  {
    id: "review-001",
    authorName: "Minh Anh",
    rating: 3,
    content: "Phong kha sach nhung check-in hoi cham, minh phai doi gan 20 phut."
  },
  {
    id: "review-002",
    authorName: "Quang Huy",
    rating: 5,
    content: "Nhan vien than thien, vi tri thuan tien, bua sang on so voi gia."
  },
  {
    id: "review-003",
    authorName: "Linh Tran",
    rating: 2,
    content: "Phong hoi ban va dieu hoa keu to vao ban dem. Mong khach san cai thien."
  },
  {
    id: "review-004",
    authorName: "Gia Bao",
    rating: 4,
    content: "Vi tri rat tien, di bo ra trung tam nhanh. Phong nho hon anh nhung van on."
  },
  {
    id: "review-005",
    authorName: "Thu Ha",
    rating: 1,
    content: "Dat phong truoc nhung den noi van phai cho lau. Le tan xu ly chua linh hoat."
  },
  {
    id: "review-006",
    authorName: "Duc Nguyen",
    rating: 5,
    content: "Dich vu tot, nhan vien chu dao, phong sach va yen tinh. Se quay lai lan sau."
  },
  {
    id: "review-007",
    authorName: "Mai Pham",
    rating: 3,
    content: "Bua sang hoi it lua chon. Bu lai nhan vien vui ve va khu vuc chung gon gang."
  },
  {
    id: "review-008",
    authorName: "Hoang Nam",
    rating: 2,
    content: "Wifi yeu vao buoi toi, lam viec rat kho. Mong khach san nang cap he thong mang."
  },
  {
    id: "review-009",
    authorName: "Bao Chau",
    rating: 4,
    content: "Check-out nhanh, giuong em, phong thom. Cach am voi hanh lang chua tot lam."
  },
  {
    id: "review-010",
    authorName: "Khanh Vy",
    rating: 5,
    content: "Gia hop ly, view dep, nhan vien ho tro dat xe rat nhanh. Trai nghiem dang tien."
  },
  {
    id: "review-011",
    authorName: "Thanh Tung",
    rating: 2,
    content: "May lan goi housekeeping khong ai nghe may. Can cai thien phan phan hoi khach."
  },
  {
    id: "review-012",
    authorName: "Ngoc Anh",
    rating: 4,
    content: "Quan cafe ben duoi tien loi, phong sach. Neu co them den ban lam viec thi tot hon."
  }
];

export const mockReviews: CustomerReview[] = sampleReviewTemplates.slice(0, 3).map(
  (review, index) => ({
    ...review,
    externalReviewId: review.id,
    placeId: demoPlaceId,
    status: "Pending",
    createdAt: createReviewedAt(index)
  })
);

export function createMockReplies(review: CustomerReview): AiReplies {
  return {
    standard: `Cam on ${review.authorName} da danh gia. Chung toi ghi nhan phan hoi cua ban va rat tiec vi trai nghiem chua tron ven. Doi ngu se kiem tra lai de cai thien chat luong dich vu.`,
    friendly: `Cam on ban da chia se that long, ${review.authorName}. Team rat tiec vi ban chua hai long o mot so diem. Chung toi se chuyen phan hoi nay cho bo phan phu trach va mong co co hoi don ban quay lai.`,
    solution: "Chung toi xin loi ve bat tien trong trai nghiem cua ban. Quan ly van hanh se ra soat noi dung review nay trong ngay hom nay va uu tien xu ly nhung van de anh huong truc tiep den khach hang."
  };
}

export function buildSampleReviewInputs(
  placeId: string,
  options: {
    count?: number;
    batchId?: string;
  } = {}
): CreateReviewInput[] {
  const selectedReviews = pickRandomReviews(sampleReviewTemplates, options.count ?? 5);
  const batchId = options.batchId ?? Date.now().toString(36);

  return selectedReviews.map((review, index) => ({
    externalReviewId: `${placeId}-${batchId}-${review.id}`,
    placeId,
    authorName: review.authorName,
    rating: review.rating,
    content: review.content,
    status: "Pending",
    createdAt: createReviewedAt(index)
  }));
}

function pickRandomReviews<T>(items: T[], count: number) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function createReviewedAt(index: number) {
  const reviewedAt = new Date();
  reviewedAt.setMinutes(reviewedAt.getMinutes() - index * 37);

  return reviewedAt.toISOString();
}
