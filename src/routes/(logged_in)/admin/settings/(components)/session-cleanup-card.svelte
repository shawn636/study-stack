<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import * as Card from '$lib/components/ui/card';

    import { Button } from '$lib/components/ui/button';
    import { apiClientSingleton as client } from '$lib/api';
    import { cn } from '$lib/utils';
    import { toast } from 'svelte-sonner';

    type $$Props = HTMLAttributes<HTMLDivElement> & {
        class?: string;
    };

    interface Props {
        class?: $$Props['class'];
    }

    const { class: className = undefined }: Props = $props();

    const deleteSessions = async () => {
        try {
            const result = await client.cronJobs.sessionCleanup();
            if (!result.success) {
                throw new Error(result.message);
            } else {
                const message =
                    result.data.authSessionsFlushed === 0
                        ? 'No sessions to clean up'
                        : `Successfully cleaned up ${result.data.authSessionsFlushed} sessions`;
                toast.success(message);
            }
        } catch {
            toast.error('Uh-oh! Something went wrong. Please try again later.');
        }
    };
</script>

<Card.Root class={cn(className)}>
    <Card.Header>
        <Card.Title>Cleanup Auth Sessions</Card.Title>
        <Card.Description>Delete expired auth sessions from the database</Card.Description>
    </Card.Header>
    <Card.Content>
        <Button onclick={deleteSessions} variant="destructive">Cleanup Sessions</Button>
    </Card.Content>
</Card.Root>
