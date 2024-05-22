export interface TestUtil {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    cleanup: () => Promise<void>;
}
