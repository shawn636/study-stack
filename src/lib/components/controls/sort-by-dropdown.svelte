<script lang="ts">
    // import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';

    import * as Select from '$lib/components/ui/select/index';
    import {
        HIGHEST_RATING,
        LOWEST_PRICE,
        RELEVANCE
    } from '$lib/models/types/course-sort-by-options';
    // import { createEventDispatcher } from 'svelte';

    // const dispatch = createEventDispatcher();

    // interface Props {
    //     value: { label: string; value: CourseSortByOption };
    // }

    interface Props {
        value: string;
        handleValueChange: (value: string) => void;
    }

    // eslint-disable-next-line prefer-const
    let { value = $bindable(''), handleValueChange }: Props = $props();

    const options = [
        { label: RELEVANCE.label, value: RELEVANCE.param },
        { label: LOWEST_PRICE.label, value: LOWEST_PRICE.param },
        { label: HIGHEST_RATING.label, value: HIGHEST_RATING.param }
    ];

    const triggerContent = $derived(
        options.find((option) => option.value === value)?.label || options[0].label
    );
</script>

<div class="min-w-36">
    <Select.Root
        type="single"
        bind:value
        onValueChange={(v: string) => {
            handleValueChange(v);
        }}
    >
        <Select.Trigger>
            {triggerContent}
        </Select.Trigger>
        <Select.Content>
            {#each options as option}
                <Select.Item label={option.label} value={option.value}>{option.label}</Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
