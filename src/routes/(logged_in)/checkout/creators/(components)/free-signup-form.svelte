<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import * as Dialog from '$lib/components/ui/dialog';

    import { Button } from '$lib/components/ui/button';
    import { buttonVariants } from '$lib/components/ui/button';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { apiClientSingleton as client } from '$lib/api';
    import { cn } from '$lib/utils';
    import Fa from 'svelte-fa';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import type { PricesGetResponse } from '$lib/api/types/prices';

    const lookupKey = $page.url.searchParams.get('lookup_key');
    const subFreq = lookupKey?.includes('yearly') ? 'year' : 'month';

    let termsChecked = $state(false);
    let prices = $state<PricesGetResponse | null>(null);
    const proLookupKey = subFreq === 'year' ? 'creators-pro-yearly' : 'creators-pro-monthly';
    const premiumPrice = $derived(
        prices?.data[proLookupKey]?.unit_amount ? prices.data[proLookupKey].unit_amount / 100 : null
    );
    const premiumUpgradeText = $derived(
        premiumPrice ? `Upgrade Now - $${premiumPrice.toFixed(2)}/${subFreq}` : 'Upgrade Now'
    );

    const freeFeatures: string[] = [
        'Up to 3 courses',
        'Access to basic content blocks',
        'Basic student engagement tools',
        'Email support'
    ];

    const premiumFeatures: string[] = [
        'Unlimited Courses',
        'Premium content blocks',
        'Student memberships',
        'Granular access control',
        'Content block marketplace'
    ];

    onMount(async () => {
        prices = await client.prices.getPrices([proLookupKey ?? '']);
    });

    const onUpgradeClick = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('lookup_key', proLookupKey);
        window.location.href = newUrl.toString();
    };
</script>

{#snippet planFeatures()}
    <aside class="grid grid-flow-row gap-5">
        <span class="text-2xl font-medium">Plan Features</span>
        <div class="grid grid-flow-row gap-2">
            {#each freeFeatures as feature}
                <div class="flex items-center gap-2">
                    <Fa icon={faCheck} />
                    <span>{feature}</span>
                </div>
            {/each}
        </div>

        <Dialog.Root>
            <Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-full')}
                >View Premium Features</Dialog.Trigger
            >
            <Dialog.Content class="rounded-lg">
                <Dialog.Header>
                    <Dialog.Title>Upgrade to Premium</Dialog.Title>
                    <Dialog.Description>
                        Get access to all features with our Premium plan
                    </Dialog.Description>
                </Dialog.Header>
                <div class="space-y-4 pt-4">
                    {#each premiumFeatures as feature}
                        <div class="flex items-center gap-2">
                            <Fa icon={faCheck} class="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                        </div>
                    {/each}

                    <Button onclick={onUpgradeClick} class="w-full">{premiumUpgradeText}</Button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    </aside>
{/snippet}

<div
    class="mx-auto mt-5 grid max-w-7xl grid-cols-1 items-start justify-items-center md:grid-cols-2"
>
    <div class="m-5 grid grid-flow-row gap-10 justify-self-start md:justify-self-center">
        <!-- Left Pane Header -->
        <div class="grid grid-flow-row">
            <span class="text-muted-foreground">Subscribe to Creators Free Plan</span>
            <div class="flex items-center gap-2">
                <span class="text-4xl font-medium">$0.00</span>
                <span class="flex flex-col leading-4 text-muted-foreground">
                    <span class="">per</span>
                    <span>{subFreq}</span>
                </span>
            </div>
            <span class="text-muted-foreground">This is the free plan for creators</span>
        </div>

        <!-- Left Pane Feature Block -->
        <div class="hidden md:block">
            {@render planFeatures()}
        </div>
    </div>

    <div class="m-5 grid min-w-full grid-flow-row gap-10">
        <Card.Root class="mx-5">
            <Card.Header>
                <Card.Title class="text-3xl">Sign up for Free Plan</Card.Title>
            </Card.Header>
            <Card.Content class="my-2">
                <form class="grid grid-flow-row gap-5">
                    <div class="flex w-full min-w-full max-w-sm flex-col gap-1.5">
                        <Label for="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" />
                    </div>

                    <div class="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            bind:checked={termsChecked}
                            aria-labelledby="terms-label"
                        />
                        <Label
                            id="terms-label"
                            for="terms"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            <span>I agree to the</span>
                            <Button variant="link" class="m-0 p-0">Terms of Service</Button>
                            <span>and</span>
                            <Button variant="link" class="m-0 p-0">Privacy Policy</Button>
                        </Label>
                    </div>

                    <Button type="submit" class="w-full">Start Free Plan</Button>
                </form>
            </Card.Content>
        </Card.Root>

        <div class="mx-5 md:hidden">
            {@render planFeatures()}
        </div>
    </div>
</div>
