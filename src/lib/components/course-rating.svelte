<script lang="ts">
    import { cn } from '$lib/utils';
    import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
    import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let rating: number;
    export let ratingCount: number;
    let className: string = '';
    export { className as class };
    $: ratingAvgRounded = Math.round(rating * 2) / 2;
</script>

<div class={cn('grid items-center justify-items-start', className)}>
    <div
        class="flex-flow-col text flex items-center justify-items-center gap-x-0.5 text-sm font-medium"
    >
        <p class="text-sm font-semibold text-yellow-500">
            {Math.round(rating * 100) / 100}
        </p>

        {#each Array.from({ length: 5 }, (_, i) => i + 1) as starIdx}
            <Fa
                class="text-yellow-500"
                icon={starIdx <= ratingAvgRounded
                    ? faStar
                    : starIdx - 0.5 === ratingAvgRounded
                      ? faStarHalfAlt
                      : faStarOutline}
                size="sm"
            />
        {/each}
        <p class="text-xs text-muted-foreground/75">({ratingCount})</p>
    </div>
</div>
