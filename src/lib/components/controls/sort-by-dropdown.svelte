<script lang="ts">
    import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';

    import * as Select from '$lib/components/ui/select/index';
    import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value: { label: string; value: CourseSortByOption };

    const options = Object.values(CourseSortByOptions).map((v) => {
        return {
            label: v.label,
            value: v
        };
    });
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
