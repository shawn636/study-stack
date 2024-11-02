<script lang="ts">
    import * as Tabs from '$lib/components/ui/tabs';
    import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    interface Props {
        value?: 'grid' | 'list';
    }

    let { value = $bindable('list') }: Props = $props();
</script>

<Tabs.Root bind:value>
    <Tabs.List>
        <Tabs.Trigger value="list">
            <Fa icon={faList} size="lg" />
        </Tabs.Trigger>
        <Tabs.Trigger value="grid">
            <Fa icon={faGrip} size="lg" />
        </Tabs.Trigger>
    </Tabs.List>
</Tabs.Root>
