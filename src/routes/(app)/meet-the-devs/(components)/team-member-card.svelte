<script>
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="max-h-128 mx-auto aspect-[3/4] min-h-64 w-full max-w-72">
    {@render children?.()}
</div>
