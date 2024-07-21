export type ToggleUserCourseFavoritePayload = {
    courseId: string;
    current: boolean;
    previous: boolean;
};

export type ToggleUserCourseFavoriteEvent = {
    toggleUserCourseFavorite: ToggleUserCourseFavoritePayload;
};
