import type { AiReplies, CustomerReview } from "../types";

export const demoPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4";

export const mockReviews: CustomerReview[] = [
  {
    id: "review-001",
    placeId: demoPlaceId,
    authorName: "Minh Anh",
    rating: 3,
    content: "Phong kha sach nhung check-in hoi cham, minh phai doi gan 20 phut.",
    status: "Pending",
    createdAt: "2026-05-20T08:30:00.000Z"
  },
  {
    id: "review-002",
    placeId: demoPlaceId,
    authorName: "Quang Huy",
    rating: 5,
    content: "Nhan vien than thien, vi tri thuan tien, bua sang on so voi gia.",
    status: "Pending",
    createdAt: "2026-05-20T07:10:00.000Z"
  },
  {
    id: "review-003",
    placeId: demoPlaceId,
    authorName: "Linh Tran",
    rating: 2,
    content: "Phong hoi ban va dieu hoa keu to vao ban dem. Mong khach san cai thien.",
    status: "Pending",
    createdAt: "2026-05-19T18:45:00.000Z"
  }
];

export function createMockReplies(review: CustomerReview): AiReplies {
  return {
    standard: `Cam on ${review.authorName} da danh gia. Chung toi ghi nhan phan hoi cua ban va rat tiec vi trai nghiem chua tron ven. Doi ngu se kiem tra lai de cai thien chat luong dich vu.`,
    friendly: `Cam on ban da chia se that long, ${review.authorName}. Team rat tiec vi ban chua hai long o mot so diem. Chung toi se chuyen phan hoi nay cho bo phan phu trach va mong co co hoi don ban quay lai.`,
    solution: "Chung toi xin loi ve bat tien trong trai nghiem cua ban. Quan ly van hanh se ra soat noi dung review nay trong ngay hom nay va uu tien xu ly nhung van de anh huong truc tiep den khach hang."
  };
}
