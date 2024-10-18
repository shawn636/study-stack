export type AcquisitionChannels = {
    organic: number;
    paid: number;
};

export type AcquisitionRecord = AcquisitionChannels & {
    date: string;
    organic: number;
    paid: number;
};

export const data: AcquisitionRecord[] = [
    { date: '2024-01-01', organic: 48, paid: 55 },
    { date: '2024-02-01', organic: 130, paid: 49 },
    { date: '2024-03-01', organic: 60, paid: 175 },
    { date: '2024-04-01', organic: 149, paid: 75 },
    { date: '2024-05-01', organic: 22, paid: 99 },
    { date: '2024-06-01', organic: 152, paid: 210 }
];
