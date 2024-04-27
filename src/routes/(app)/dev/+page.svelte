<script lang="ts">
    import ViewToggle from '$lib/components/controls/view-toggle.svelte';
    let buttonValue: 'grid' | 'list';
</script>

<div class="grid grid-flow-row p-5">
    <h1 class="pb-10 text-2xl font-medium">Currently In Development</h1>

    <div class="border border-dashed border-pink-500 p-4">
        <!-- ENTER CODE BELOW -->
        <ViewToggle bind:value={buttonValue} />

        <!-- ENTER CODE ABOVE -->
    </div>
</div>
