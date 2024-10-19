export type ToggleCourseFavoritePayload = {
    courseId: string;
    current: boolean;
    previous: boolean;
};

export type ToggleCourseFavoriteEvent = {
    toggleCourseFavorite: ToggleCourseFavoritePayload;
};
