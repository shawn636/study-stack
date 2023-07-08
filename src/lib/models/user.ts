export default interface User {
    id: string;
    email: string;
    name: string;
    country_code: string | null;
    area_code: string | null;
    phone_number: string | null;
    bio: string | null;
    city: string | null;
    state: string | null;
    photo_url: string | null;
}
