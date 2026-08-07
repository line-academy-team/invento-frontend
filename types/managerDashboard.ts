// 백엔드 Prisma 스키마에 정의된 RentalStatus와 동일하게 맞춥니다.
// (이미 rental.ts 같은 곳에 정의되어 있다면 그 타입을 임포트해서 쓰셔도 됩니다)
export type RentalStatus = "REQUESTED" | "REJECTED" | "BORROWED" | "RETURNED" | "CANCELLED";

// 1. 최근 대여 요청 목록의 개별 아이템 타입
export interface RecentRentalItem {
    id: number;
    equipment: string;
    name: string;
    date: string; // "MM.DD" 형식
    status: RentalStatus;
}

// 2. 대시보드 상단 요약 카드 데이터 타입
export interface DashboardSummary {
    totalEquipment: number; // 전체 장비 수
    borrowed: number; // 대여중
    requested: number; // 대여 요청
    brokenReports: number; // 고장 신고
}

// 3. 서비스(Service)에서 반환하는 전체 데이터 타입
export interface ManagerDashboardData {
    summary: DashboardSummary;
    recentRentals: RecentRentalItem[];
}

// 4. 컨트롤러(Controller)를 거쳐 최종적으로 받는 API 응답 타입
export interface GetManagerDashboardResponse {
    message: string;
    data: ManagerDashboardData;
}
