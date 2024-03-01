<script lang="ts">
    export let color = 'white';
    export let layout: 'horizontal' | 'vertical' = 'horizontal';
</script>

<div
    class="grid items-center p-2 grid-flow-{layout === 'horizontal'
        ? 'col'
        : 'row'} justify-items-center gap-x-2"
>
    <div class="h-8 w-8 rounded-md bg-surface-400" />
    <p class="text-lg font-medium text-{color}">Equipped</p>
</div>
