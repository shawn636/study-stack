export default interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    discountedPrice: number;
    instructor: string;
    organization: string;
    difficulty: string;
    img_href: string;
}
