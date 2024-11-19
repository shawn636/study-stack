<script lang="ts">
    import type { PricesGetResponse } from '$lib/api/types/prices';

    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';
    import Fa from 'svelte-fa';
    import { Separator } from '$lib/components/ui/separator';
    import { Switch } from '$lib/components/ui/switch';

    let isYearly = $state(true);

    interface Props {
        class?: string;
        priceData: PricesGetResponse;
    }
    const { class: className, priceData }: Props = $props();

    const extractPrice = (price: string) => {
        if (price === '') {
            return 0;
        }
        return price ? Number(price) / 100 : 0;
    };

    const formatPrice = (price: number) => {
        const formattedPrice = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: price % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        });
        return formattedPrice;
    };

    const getPlanPrice = (plan: string) => {
        const lookupKey = isYearly ? `${plan}-yearly` : `${plan}-monthly`;

        return formatPrice(extractPrice(priceData.data[lookupKey]?.unit_amount_decimal ?? ''));
    };

    const getAnnualBillingTotal = (plan: string) => {
        const lookupKey = isYearly ? `${plan}-yearly` : `${plan}-monthly`;

        if (isYearly) {
            return formatPrice(extractPrice(priceData.data[lookupKey]?.unit_amount_decimal ?? ''));
        }

        return formatPrice(extractPrice(priceData.data[lookupKey]?.unit_amount_decimal ?? '') * 12);
    };

    const getCheckoutLink = (plan: string) => {
        const lookupKey = isYearly ? `${plan}-yearly` : `${plan}-monthly`;
        return `/checkout/creators?lookup_key=${lookupKey}`;
    };
</script>

<section class={cn(className)}>
    <div class="container">
        <div class="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
            <h2 class="text-pretty text-4xl font-bold lg:text-6xl">Pricing</h2>
            <p class="text-muted-foreground lg:text-xl">Choose the plan that’s right for you</p>
            <div class="flex items-center gap-3 text-lg">
                Monthly
                <Switch onchange={() => (isYearly = !isYearly)} bind:checked={isYearly} />
                Yearly
            </div>
            <div class="flex flex-col items-stretch gap-6 md:flex-row">
                <!-- Free Plan Card -->
                <Card class="flex w-80 flex-col justify-between text-left">
                    <CardHeader>
                        <CardTitle>
                            <p>Free</p>
                        </CardTitle>
                        <p class="text-sm text-muted-foreground">Start teaching today</p>
                        <span class="text-4xl font-bold">{getPlanPrice('creators-free')}</span>
                        <p class="text-muted-foreground">No cost, no commitment</p>
                    </CardHeader>
                    <CardContent>
                        <Separator class="mb-6" />
                        <ul class="space-y-4">
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Up to 3 courses</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Access to basic content blocks</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Basic student engagement tools</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Email support</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter class="mt-auto">
                        <Button href={getCheckoutLink('creators-free')} class="w-full">
                            Get Started
                            <Fa icon={faArrowRight} class="ml-2 size-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <!-- Pro Plan Card -->
                <Card class="flex w-80 flex-col justify-between text-left">
                    <CardHeader>
                        <CardTitle>
                            <p>Pro</p>
                        </CardTitle>
                        <p class="text-sm text-muted-foreground">Unlock your full potential</p>
                        <span class="text-4xl font-bold">{getPlanPrice('creators-pro')}</span>
                        <p class="text-muted-foreground">
                            Billed {getAnnualBillingTotal('creators-pro')} annually
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Separator class="mb-6" />
                        <p class="mb-3 text-lg font-semibold">Everything in Free, plus:</p>
                        <ul class="space-y-4">
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Unlimited courses</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Premium content blocks</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Student memberships</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Granular access control</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <Fa icon={faCircleCheck} class="size-4" />
                                <span>Content block marketplace</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter class="mt-auto">
                        <Button href={getCheckoutLink('creators-pro')} class="w-full">
                            Get Started
                            <Fa icon={faArrowRight} class="ml-2 size-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
</section>
