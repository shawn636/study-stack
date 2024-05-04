<script lang="ts">
    import SidebarDropdown from './sidebar-dropdown.svelte';
    import SidebarList from './sidebar-list.svelte';
    export let items: { href: string; title: string }[];
</script>

<SidebarList class="hidden sm:flex" {items} />
<SidebarDropdown class="block sm:hidden" {items} />
