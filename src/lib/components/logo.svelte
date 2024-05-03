<script lang="ts">
    export let colorClass = 'text-white';
    export let layout: 'horizontal' | 'vertical' = 'horizontal';

    $: baseClass = `text-lg font-medium ${colorClass}`;
</script>

<div
    class="grid items-center p-2 grid-flow-{layout === 'horizontal'
        ? 'col'
        : 'row'} justify-items-center gap-x-2"
>
    <div class="h-8 w-8 rounded-md bg-slate-400" />
    <p class={baseClass}>Equipped</p>
</div>
