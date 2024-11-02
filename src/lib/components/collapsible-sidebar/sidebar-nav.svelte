<script lang="ts">
    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

    import SidebarDropdown from './sidebar-dropdown.svelte';
    import SidebarList from './sidebar-list.svelte';
    interface Props {
        items: { href: string; icon: IconDefinition | undefined; title: string }[];
    }

    let { items }: Props = $props();
</script>

<SidebarList class="hidden sm:flex" {items} />
<SidebarDropdown class="block sm:hidden" {items} />
