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
  const context = getReplyContext(review);

  return {
    standard: `Cam on ${review.authorName} da gui danh gia. Chung toi da ghi nhan phan hoi ve ${context.issue} va se xem lai voi bo phan phu trach de cai thien trai nghiem khach hang trong thoi gian toi.`,
    friendly: `${review.authorName} oi, cam on ban da chia se rat cu the. Team rat vui khi nhan duoc diem ban hai long va cung tiec ve ${context.issue}. Chung toi mong co co hoi don ban quay lai voi trai nghiem tot hon.`,
    solution: `Chung toi xin loi ve bat tien lien quan den ${context.issue}. ${context.action} Phan hoi cua ban se duoc uu tien theo doi de han che viec tuong tu lap lai voi cac khach tiep theo.`
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

function getReplyContext(review: CustomerReview) {
  const content = review.content.toLowerCase();

  if (content.includes("check-in") || content.includes("cho lau") || content.includes("cham")) {
    return {
      issue: "thoi gian cho va quy trinh check-in",
      action: "Quan ly le tan se ra soat lai lich truc va cach xu ly khach den cung thoi diem."
    };
  }

  if (content.includes("ban") || content.includes("sach") || content.includes("housekeeping")) {
    return {
      issue: "ve sinh phong va toc do ho tro housekeeping",
      action: "Bo phan housekeeping se kiem tra lai checklist ve sinh truoc khi ban giao phong."
    };
  }

  if (content.includes("wifi") || content.includes("mang")) {
    return {
      issue: "chat luong ket noi wifi",
      action: "Doi ky thuat se kiem tra lai diem phat song va tai ket noi vao khung gio cao diem."
    };
  }

  if (content.includes("bua sang")) {
    return {
      issue: "lua chon bua sang",
      action: "Bo phan am thuc se xem lai thuc don va bo sung lua chon phu hop hon."
    };
  }

  if (content.includes("dieu hoa") || content.includes("cach am")) {
    return {
      issue: "tien nghi va su yen tinh trong phong",
      action: "Doi bao tri se kiem tra lai trang thiet bi va cac phong co phan anh tuong tu."
    };
  }

  return {
    issue: "nhung diem chua tron ven trong trai nghiem",
    action: "Quan ly van hanh se xem lai phan hoi nay va lam viec voi bo phan lien quan."
  };
}
