export type ContentPerformance = {
    comments: number;
    likes: number;
    views: number;
};
export type ContentPerformanceRecord = { date: string } & ContentPerformance;

export const data: ContentPerformanceRecord[] = [
    { comments: 48, date: '2024-01-01', likes: 55, views: 100 },
    { comments: 130, date: '2024-02-01', likes: 49, views: 200 },
    { comments: 60, date: '2024-03-01', likes: 175, views: 150 },
    { comments: 149, date: '2024-04-01', likes: 75, views: 250 },
    { comments: 22, date: '2024-05-01', likes: 99, views: 300 },
    { comments: 152, date: '2024-06-01', likes: 210, views: 200 }
];
