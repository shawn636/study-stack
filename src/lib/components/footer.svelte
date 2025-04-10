<script lang="ts">
    import type { NewsletterSubscriptionCreateResponse } from '$lib/api/types/newsletter-subscriptions';

    import * as Accordion from '$lib/components/ui/accordion/index';

    import {
        faFacebookF,
        faInstagram,
        faLinkedinIn,
        faTwitter
    } from '@fortawesome/free-brands-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { apiClientSingleton as client } from '$lib/api';
    import Fa from 'svelte-fa';
    import { Input } from '$lib/components/ui/input';
    import Logo from '$lib/components/logo.svelte';
    import { toast } from 'svelte-sonner';

    let email: string = $state('');

    const subscribe = async () => {
        if (!email) {
            toast.error('Please enter a valid email address');
            return;
        }

        let response: NewsletterSubscriptionCreateResponse | null = null;
        try {
            response = await client.newsletter.subscribe(email);

            if (response.success) {
                toast.success('You have successfully subscribed to our newsletter!');
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again later');
        }
    };
</script>

<div class="w-full bg-gray-800 p-4 text-white sm:p-10">
    <!-- Logo and Social Media Bar (Below) -->
    <div class="grid-rows grid items-center justify-items-center sm:grid-cols-[auto_1fr]">
        <Logo colorClass="text-white" />
        <div
            class="grid grid-flow-row items-center gap-y-2 sm:grid-flow-col sm:gap-x-2 sm:justify-self-end"
        >
            <aside class="font-light">Follow Us On Social Media</aside>
            <div class="grid grid-flow-col items-center">
                <a
                    class="hover:bg-primary-800 grid h-8 w-8 items-center justify-items-center rounded-full p-1"
                    href="https://www.facebook.com/"
                >
                    <Fa icon={faFacebookF} size="lg" />
                </a>
                <a
                    class="hover:bg-primary-800 grid h-8 w-8 items-center justify-items-center rounded-full p-1"
                    href="https://www.twitter.com/"
                >
                    <Fa icon={faTwitter} size="lg" />
                </a>
                <a
                    class="hover:bg-primary-800 grid h-8 w-8 items-center justify-items-center rounded-full p-1"
                    href="https://www.instagram.com/"
                >
                    <Fa icon={faInstagram} size="lg" />
                </a>
                <a
                    class="hover:bg-primary-800 grid h-8 w-8 items-center justify-items-center rounded-full p-1"
                    href="https://www.linkedin.com/"
                >
                    <Fa icon={faLinkedinIn} size="lg" />
                </a>
            </div>
        </div>
    </div>
    <!-- Logo and Social Media Bar (Above) -->

    <hr class="!border-t-1 my-4 !border-gray-600" />

    <!-- Only visible for sm brekpoint or below -->
    <!-- Contact Us Box (Below) -->
    <div class="grid grid-flow-row pb-4 pt-2 sm:hidden">
        <p class="pb-2 pl-4 font-semibold uppercase">Get In Touch</p>
        <p class="pl-4">Don't worry, we don't send spam.</p>
        <div class="relative mt-2">
            <div class="flex items-center gap-2">
                <Input
                    bind:value={email}
                    class="bg-white text-black placeholder:text-gray-500"
                    name="email"
                    placeholder="Email Address"
                    required
                    type="text"
                />
                <Button
                    aria-label="Submit Email Address"
                    class="bg-white text-black hover:bg-gray-100"
                    onclick={subscribe}
                    type="button"
                    variant="secondary">Submit</Button
                >
            </div>
        </div>
    </div>
    <!-- Contact Us Box (Above) -->

    <!-- Only for <= sm breakpoint -->
    <!-- Link Accordion (Below) -->
    <div class="block sm:hidden">
        <Accordion.Root type="single">
            <Accordion.Item value="about">
                <Accordion.Trigger>About</Accordion.Trigger>
                <Accordion.Content>
                    <div data-testid="about-navlist">
                        <ul>
                            <li>
                                <Button
                                    aria-label="Navigate to about us page"
                                    class="text-foreground decoration-foreground"
                                    href="/about"
                                    role="link"
                                    variant="link">About Us</Button
                                >
                            </li>
                        </ul>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="categories">
                <Accordion.Trigger>Categories</Accordion.Trigger>
                <Accordion.Content>
                    <div data-testid="categories-navlist">
                        <ul>
                            <li>
                                <Button href="/" variant="link">Language & Communication</Button>
                            </li>
                            <li><Button href="/" variant="link">Science & Technology</Button></li>
                            <li><Button href="/" variant="link">Health & Wellness</Button></li>
                            <li>
                                <Button href="/" variant="link">Leadership & Personal Growth</Button
                                >
                            </li>
                            <li><Button href="/" variant="link">Creative Arts</Button></li>
                            <li><Button href="/" variant="link">History & Culture</Button></li>
                            <li>
                                <Button href="/" variant="link">Psychology & Counseling</Button>
                            </li>
                            <li><Button href="/" variant="link">Community Engagement</Button></li>
                            <li>
                                <Button href="/" variant="link">Project & Team Management</Button>
                            </li>
                        </ul>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    </div>
    <!-- Link Accordion (Above) -->

    <!-- Only for > sm breakpoints -->
    <!-- Link Columns (Below) -->
    <div
        class="text-md hidden grid-flow-col grid-cols-3 grid-rows-[1fr_auto] justify-items-center gap-y-8 font-light md:grid lg:grid-cols-4 lg:grid-rows-1"
    >
        <!-- CATEOGIRIES -->
        <div class="row-start-1 row-end-2">
            <h4 class="h4 grid pb-2 uppercase">Categories</h4>
            <ul class="grid gap-y-1">
                <li><a href="/" class="hover:underline">Language & Communication</a></li>
                <li><a href="/" class="hover:underline">Science & Technology</a></li>
                <li><a href="/" class="hover:underline">Health & Wellness</a></li>
                <li><a href="/" class="hover:underline">Leadership & Personal Growth</a></li>
                <li><a href="/" class="hover:underline">Creative Arts</a></li>
                <li><a href="/" class="hover:underline">History & Culture</a></li>
            </ul>
        </div>
        <!-- ABOUT -->
        <div class="row-start-1 row-end-2">
            <h4 class="h4 grid pb-2 uppercase">About</h4>
            <ul class="grid gap-y-1">
                <li>
                    <a href="/about" class="text-foreground decoration-foreground hover:underline"
                        >About Us</a
                    >
                </li>
                <li>
                    <a href="/" class="text-foreground decoration-foreground hover:underline"
                        >Learner Stories</a
                    >
                </li>
                <li>
                    <a href="/" class="text-foreground decoration-foreground hover:underline"
                        >Careers</a
                    >
                </li>
                <li>
                    <a href="/" class="text-foreground decoration-foreground hover:underline"
                        >Press</a
                    >
                </li>
                <li>
                    <a href="/" class="text-foreground decoration-foreground hover:underline"
                        >Leadership</a
                    >
                </li>
                <li>
                    <a
                        href="/meet-the-devs"
                        class="text-foreground decoration-foreground hover:underline"
                        >Meet the Devs</a
                    >
                </li>
            </ul>
        </div>
        <!-- SUPPORT -->
        <div class="row-start-1 row-end-2">
            <h4 class="h4 grid pb-2 uppercase">Support</h4>
            <ul class="grid gap-y-1">
                <li>
                    <a href="/" class="text-foreground decoration-foreground hover:underline"
                        >Documentation</a
                    >
                </li>
                <li>
                    <a href="/about" class="text-foreground decoration-foreground hover:underline"
                        >About Us</a
                    >
                </li>
                <li>
                    <a href="/home" class="text-foreground decoration-foreground hover:underline"
                        >Dashboard</a
                    >
                </li>
                <li>
                    <a href="/contact" class="text-foreground decoration-foreground hover:underline"
                        >Contact Us</a
                    >
                </li>
            </ul>
        </div>

        <!-- Contact Us Box (Below) -->
        <div
            class="col-span-2 col-start-1 row-span-1 row-start-2 justify-self-start pl-4 lg:col-span-1 lg:col-start-4 lg:row-start-1"
        >
            <p class="pb-1 font-semibold uppercase">Get In Touch</p>
            <p>Don't worry, we don't send spam.</p>
            <div class="relative mt-2">
                <div class="flex items-center gap-2">
                    <Input
                        bind:value={email}
                        class="bg-white text-black placeholder:text-gray-500"
                        name="email"
                        placeholder="Email Address"
                        required
                        type="text"
                    />
                    <Button
                        aria-label="Submit Email Address"
                        class="bg-white text-black hover:bg-gray-100"
                        onclick={subscribe}
                        type="button"
                        variant="secondary">Submit</Button
                    >
                </div>
            </div>
        </div>
        <!-- Contact Us Box (Above) -->
    </div>
    <!-- Link Columns (Above) -->
</div>
