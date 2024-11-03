<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import * as Card from '$lib/components/ui/card';
    import * as Table from '$lib/components/ui/table';
    import { cn } from '$lib/utils.js';

    type $$Props = HTMLAttributes<HTMLDivElement>;

    interface Props {
        class?: $$Props['class'];
    }

    const { class: className = undefined }: Props = $props();

    const data = [
        { engagement: '8.2%', title: 'The Ultimate Guide to Web Development', views: '12.3K' },
        {
            engagement: '6.5%',
            title: '5 Proven Strategies to Boost Website Traffic',
            views: '9.7k'
        },
        { engagement: '5.1%', title: '10 Productivity Tools Every Developer Needs', views: '7.4K' },
        { engagement: '4.8%', title: 'The Future of Artificial Intelligence', views: '6.2K' }
    ];
</script>

<Card.Root class={cn(className)}>
    <Card.Header>
        <Card.Title>Top Performing Content</Card.Title>
        <Card.Description>Most viewed and engaged content on your website.</Card.Description>
    </Card.Header>
    <Card.Content>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Title</Table.Head>
                    <Table.Head>Views</Table.Head>
                    <Table.Head>Engagement</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each data as { engagement, title, views }}
                    <Table.Row>
                        <Table.Cell class="font-medium">{title}</Table.Cell>
                        <Table.Cell>{views}</Table.Cell>
                        <Table.Cell>{engagement}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Content>
</Card.Root>
