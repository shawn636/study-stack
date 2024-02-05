<script lang="ts">
    import type { CssClasses } from '@skeletonlabs/skeleton';
    let width: CssClasses = 'w-1/2';
    let height: CssClasses = 'h-px';

    $: baseClass = `${width} ${height} bg-surface-500`;
</script>

<div class="grid grid-flow-row p-5">
    <h1 class="pb-10 text-2xl font-medium">Currently In Development</h1>

    <div class="p-4 border border-pink-500 border-dashed">
        <!-- ENTER CODE BELOW -->

        <!-- <div class="w-{width} h-{height} bg-surface-500"></div> -->
        <div class={baseClass}></div>

        <!-- ENTER CODE ABOVE -->
    </div>
</div>
