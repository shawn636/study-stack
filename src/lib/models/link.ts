import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
export default interface Link {
    href: string;
    icon: IconDefinition | undefined;
    name: string;
}
