<script lang="ts">
    interface Props {
        colorClass?: string;
        layout?: 'horizontal' | 'vertical';
        variant?: 'color-dark' | 'color-light' | 'mono-dark' | 'mono-light';
    }

    const {
        colorClass = 'text-white',
        layout = 'horizontal',
        variant = 'mono-light'
    }: Props = $props();

    const baseClass = $derived(`text-lg font-medium ${colorClass}`);
</script>

<div
    class="grid items-center p-2 grid-flow-{layout === 'horizontal'
        ? 'col'
        : 'row'} justify-items-center gap-x-2"
>
    <!-- <div class="h-8 w-8 rounded-md bg-slate-400"></div> -->
    <img src={`/images/logo-${variant}.svg`} alt="logo" class="h-10" />
    <p class={baseClass}>StudyStack</p>
</div>
