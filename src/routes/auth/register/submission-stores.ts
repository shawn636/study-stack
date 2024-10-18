import { writable } from 'svelte/store';

type SubmissionState = 'error' | 'idle' | 'submitting';

export const submissionError = writable<string | null>(null);
export const submissionState = writable<SubmissionState>('idle');
