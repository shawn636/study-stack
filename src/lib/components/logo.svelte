<script lang="ts">
    interface Props {
        colorClass?: string;
        layout?: 'horizontal' | 'vertical';
    }

    const { colorClass = 'text-white', layout = 'horizontal' }: Props = $props();

    const baseClass = $derived(`text-lg font-medium ${colorClass}`);
</script>

<div
    class="grid items-center p-2 grid-flow-{layout === 'horizontal'
        ? 'col'
        : 'row'} justify-items-center gap-x-2"
>
    <div class="h-8 w-8 rounded-md bg-slate-400"></div>
    <p class={baseClass}>StudyStack</p>
</div>
