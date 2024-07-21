<script lang="ts">
    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

    import SidebarDropdown from './sidebar-dropdown.svelte';
    import SidebarList from './sidebar-list.svelte';
    export let items: { href: string; icon: IconDefinition | undefined; title: string }[];
</script>

<SidebarList class="hidden sm:flex" {items} />
<SidebarDropdown class="block sm:hidden" {items} />
