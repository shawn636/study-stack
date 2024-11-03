<script lang="ts">
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import * as Card from '$lib/components/ui/card';

    import { cn } from '$lib/utils';
    import { createEventDispatcher } from 'svelte';
    import { Switch } from '$lib/components/ui/switch';

    const dispatch = createEventDispatcher();

    interface Props {
        class?: string | null | undefined;
        value?: boolean;
        title: string;
        description: string;
        tag: string;
        alertTitle: string;
        alertDescription: string;
    }

    let {
        // eslint-disable-next-line prefer-const
        class: className = undefined,
        value = $bindable(false), // eslint-disable-next-line prefer-const
        title, // eslint-disable-next-line prefer-const
        description, // eslint-disable-next-line prefer-const
        tag, // eslint-disable-next-line prefer-const
        alertTitle, // eslint-disable-next-line prefer-const
        alertDescription
    }: Props = $props();

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
                <Switch bind:checked={value} onclick={(e) => e.preventDefault()} />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>{alertTitle}</AlertDialog.Title>
                    <AlertDialog.Description>{alertDescription}</AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action onclick={toggle}>Continue</AlertDialog.Action>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>
        <p>{tag}</p>
    </Card.Content>
</Card.Root>
