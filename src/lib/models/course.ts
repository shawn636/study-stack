export default interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    current_price: number;
    original_price: number;
    instructor: string;
    organization: string | null;
    difficulty: string;
    img_href: string;
    estimated_time_hours: number;
    estimated_time_minutes: number;
    lesson_cnt: number;
    rating_cnt: number;
    rating_avg: number;
}
