<script lang="ts">
    import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';

    import * as Select from '$lib/components/ui/select/index';
    import {
        HIGHEST_RATING,
        LOWEST_PRICE,
        RELEVANCE
    } from '$lib/models/types/course-sort-by-options';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value: { label: string; value: CourseSortByOption };

    const options = [
        { label: RELEVANCE.label, value: RELEVANCE },
        { label: LOWEST_PRICE.label, value: LOWEST_PRICE },
        { label: HIGHEST_RATING.label, value: HIGHEST_RATING }
    ];
</script>

<div class="min-w-36">
    <Select.Root
        bind:selected={value}
        onSelectedChange={(v) => {
            dispatch('valuechange', v);
        }}
    >
        <Select.Trigger>
            <Select.Value placeholder="Sort By" />
        </Select.Trigger>
        <Select.Content>
            {#each options as option}
                <Select.Item label={option.label} value={option.value}>{option.label}</Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
