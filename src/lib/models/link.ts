import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
export default interface Link {
    name: string;
    href: string;
    icon: IconDefinition | undefined;
}
