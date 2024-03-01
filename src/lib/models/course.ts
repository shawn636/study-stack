export default interface Course {
    category: string;
    current_price: number;
    description: string;
    difficulty: string;
    estimated_time_hours: number;
    estimated_time_minutes: number;
    id: string;
    img_href: string;
    instructor: string;
    lesson_cnt: number;
    organization: null | string;
    original_price: number;
    rating_avg: number;
    rating_cnt: number;
    title: string;
}
