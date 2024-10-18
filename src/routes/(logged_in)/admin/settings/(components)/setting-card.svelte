<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import * as Card from '$lib/components/ui/card';

    import { cn } from '$lib/utils';
    import { createEventDispatcher } from 'svelte';
    import { Switch } from '$lib/components/ui/switch';

    const dispatch = createEventDispatcher();

    type $$Props = HTMLAttributes<HTMLDivElement> & {
        alertDescription: string;
        alertTitle: string;
        class?: string;
        description: string;
        tag: string;
        title: string;
        value?: boolean;
    };

    let className: $$Props['class'] = undefined;
    export { className as class };
    export let value: boolean = false;
    export let title: string;
    export let description: string;
    export let tag: string;
    export let alertTitle: string;
    export let alertDescription: string;

    const toggle = () => {
        value = !value;
        dispatch('change', value);
    };
</script>

<Card.Root class={cn(className)}>
    <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content class="flex gap-2">
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Switch bind:checked={value} on:click={(e) => e.preventDefault()} />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>{alertTitle}</AlertDialog.Title>
                    <AlertDialog.Description>{alertDescription}</AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action on:click={toggle}>Continue</AlertDialog.Action>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>
        <p>{tag}</p>
    </Card.Content>
</Card.Root>
