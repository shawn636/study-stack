<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    import { pageHeight, scrollPosition } from '$lib/stores/scroll';
    import {
        faFacebookF,
        faInstagram,
        faLinkedinIn,
        faTwitter
    } from '@fortawesome/free-brands-svg-icons';
    import {
        Accordion,
        AccordionItem,
        type ToastSettings,
        getToastStore
    } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    let email: string = '';

    const subscribe = async () => {
        if (!email) {
            toastStore.trigger({
                autohide: true,
                classes: 'bg-warning-500 text-black',
                message: 'Please enter a valid email address.',
                timeout: 3000
            });
            return;
        }
        const request = await fetch('/api/subscribe', {
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        let toastSettings: ToastSettings | undefined;

        if (request.ok) {
            toastSettings = {
                autohide: true,
                classes: 'text-white bg-primary-500',
                message: 'You have successfully subscribed to our newsletter!',
                timeout: 3000
            };
        } else {
            toastSettings = {
                autohide: true,
                classes: 'bg-error-500',
                message: 'Something went wrong. Please try again later.',
                timeout: 3000
            };
        }
        toastStore.trigger(toastSettings);
    };
    const toastStore = getToastStore();
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
                    class="grid h-8 w-8 items-center justify-items-center rounded-full p-1 hover:bg-primary-800"
                    href="https://www.facebook.com/"
                >
                    <Fa icon={faFacebookF} size="lg" />
                </a>
                <a
                    class="grid h-8 w-8 items-center justify-items-center rounded-full p-1 hover:bg-primary-800"
                    href="https://www.twitter.com/"
                >
                    <Fa icon={faTwitter} size="lg" />
                </a>
                <a
                    class="grid h-8 w-8 items-center justify-items-center rounded-full p-1 hover:bg-primary-800"
                    href="https://www.instagram.com/"
                >
                    <Fa icon={faInstagram} size="lg" />
                </a>
                <a
                    class="grid h-8 w-8 items-center justify-items-center rounded-full p-1 hover:bg-primary-800"
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
            <div class="flex">
                <input
                    class="input w-full rounded-l-full rounded-r-none !border-0 !bg-surface-100 placeholder-surface-500"
                    name="email"
                    placeholder="Email Address"
                    required
                    type="text"
                />
                <button
                    aria-label="Submit Email Address"
                    class=" variant-filled-secondary btn rounded-l-none rounded-r-full font-medium text-primary-500"
                    type="button">Submit</button
                >
            </div>
        </div>
    </div>
    <!-- Contact Us Box (Above) -->

    <!-- Only for <= sm breakpoint -->
    <!-- Link Accordion (Below) -->
    <div class="block sm:hidden">
        <Accordion>
            <AccordionItem>
                <svelte:fragment slot="summary"><p class="uppercase">About</p></svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="list-nav">
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/">Learner Stories</a></li>
                            <li><a href="/">Careers</a></li>
                            <li><a href="/">Press</a></li>
                            <li><a href="/">Leadership</a></li>
                        </ul>
                    </div>
                </svelte:fragment>
            </AccordionItem>
            <AccordionItem>
                <svelte:fragment slot="summary"><p class="uppercase">Categories</p></svelte:fragment
                >
                <svelte:fragment slot="content">
                    <div class="list-nav">
                        <ul>
                            <li><a href="/">Biblical Studies</a></li>
                            <li><a href="/">Theology & Doctrine</a></li>
                            <li><a href="/">Spiritual Formation & Discipleship</a></li>
                            <li><a href="/">Christian Ministry & Mission:</a></li>
                            <li><a href="/">Worship and Creative Arts</a></li>
                            <li><a href="/">Biblical Languages</a></li>
                            <li><a href="/">Christian Counseling & Psychology</a></li>
                            <li><a href="/">Christian Missions & Outreach</a></li>
                            <li><a href="/">Church Administration & Management</a></li>
                        </ul>
                    </div>
                </svelte:fragment>
            </AccordionItem>
            <AccordionItem>
                <svelte:fragment slot="summary"><p class="uppercase">Support</p></svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="list-nav">
                        <ul>
                            <li><a href="/">Documentation</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/home">Dashboard</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                        </ul>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        </Accordion>
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
                <li><a href="/">Biblical Studies</a></li>
                <li><a href="/">Theology & Doctrine</a></li>
                <li><a href="/">Discipleship</a></li>
                <li><a href="/">Ministry & Mission</a></li>
                <li><a href="/">Worship & Creative Arts</a></li>
                <li><a href="/">Biblical Languages</a></li>
            </ul>
        </div>
        <!-- ABOUT -->
        <div class="row-start-1 row-end-2">
            <h4 class="h4 grid pb-2 uppercase">About</h4>
            <ul class="grid gap-y-1">
                <li><a href="/about">About Us</a></li>
                <li><a href="/">Learner Stories</a></li>
                <li><a href="/">Careers</a></li>
                <li><a href="/">Press</a></li>
                <li><a href="/">Leadership</a></li>
            </ul>
        </div>
        <!-- SUPPORT -->
        <div class="row-start-1 row-end-2">
            <h4 class="h4 grid pb-2 uppercase">Support</h4>
            <ul class="grid gap-y-1">
                <li><a href="/">Documentation</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/home">Dashboard</a></li>
                <li><a href="/contact">Contact Us</a></li>
            </ul>
        </div>

        <!-- Contact Us Box (Below) -->
        <div
            class="col-span-2 col-start-1 row-span-1 row-start-2 justify-self-start lg:col-span-1 lg:col-start-4 lg:row-start-1"
        >
            <p class="pb-2 pl-4 font-semibold uppercase">Get In Touch</p>
            <p class="pl-4">Don't worry, we don't send spam.</p>
            <div class="relative mt-2">
                <div class="flex">
                    <input
                        bind:value={email}
                        class="input w-full rounded-l-full rounded-r-none !border-0 !bg-surface-100 text-surface-600 placeholder-surface-400"
                        name="email"
                        placeholder="Email Address"
                        required
                        type="text"
                    />
                    <button
                        aria-label="Submit Email Address"
                        class="variant-filled-secondary btn rounded-l-none rounded-r-full font-medium active:scale-100"
                        on:click={subscribe}
                        type="button">Submit</button
                    >
                </div>
            </div>
        </div>
        <!-- Contact Us Box (Above) -->
    </div>
    <!-- Link Columns (Above) -->

    <p class="mt-8">© 2023 Equipped LLC.</p>
</div>

{#if $scrollPosition > $pageHeight}
    <div class="absolute bottom-0 -z-10 h-64 w-full bg-gray-800" />
{/if}
