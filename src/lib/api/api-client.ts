import AdminSettingsModule from './endpoints/admin-settings';
import CategoriesModule from './endpoints/categories';
import ContactMessagesModule from './endpoints/contact-messages';
import CoursesModule from './endpoints/courses';

class ApiClient {
    private baseUrl: string;
    private fetchMode: 'absolute' | 'relative';

    /**
     * Theses are the modules that handle the API interactions for the different endpoints.
     * They are created with a reference to this ApiClient instance so they can make network requests.
     */
    adminSettings = new AdminSettingsModule(this);
    categories = new CategoriesModule(this);
    contactMessages = new ContactMessagesModule(this);
    courses = new CoursesModule(this);

    constructor(fetchMode: 'absolute' | 'relative' = 'relative', baseUrl: string = '') {
        if (fetchMode === 'absolute' && !baseUrl) {
            throw new Error('baseUrl is required when fetchMode is absolute');
        }

        if (fetchMode === 'absolute' && !baseUrl.startsWith('http')) {
            throw new Error('baseUrl must start with http or https when fetchMode is absolute');
        }

        this.baseUrl = baseUrl && baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.fetchMode = fetchMode;
    }

    getFullUrl(path: string) {
        return this.fetchMode === 'relative' ? path : `${this.baseUrl}${path}`;
    }

    setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setFetchMode(fetchMode: 'absolute' | 'relative') {
        this.fetchMode = fetchMode;
    }
}
const apiClientSingleton = new ApiClient();
export { ApiClient, apiClientSingleton };
