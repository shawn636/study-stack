<script lang="ts">
    import Fa from 'svelte-fa';
    import {
        faFacebookF,
        faTwitter,
        faInstagram,
        faLinkedinIn
    } from '@fortawesome/free-brands-svg-icons';
    import Logo from '$lib/components/logo.svelte';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import { scrollPosition, pageHeight } from '$lib/stores/scroll';
</script>

<div class="w-full p-4 text-white bg-gray-800 sm:p-10">
    <!-- Logo and Social Media Bar (Below) -->
    <div class="grid grid-rows sm:grid-cols-[auto_1fr] justify-items-center items-center">
        <Logo />
        <div
            class="items-center sm:justify-self-end grid grid-flow-row sm:grid-flow-col gap-y-2 sm:gap-x-2"
        >
            <aside class="font-light">Follow Us On Social Media</aside>
            <div class="items-center grid grid-flow-col">
                <a
                    href="https://www.facebook.com/"
                    class="items-center w-8 h-8 p-1 rounded-full hover:bg-primary-800 grid justify-items-center"
                >
                    <Fa icon={faFacebookF} size="20" />
                </a>
                <a
                    href="https://www.twitter.com/"
                    class="items-center w-8 h-8 p-1 rounded-full hover:bg-primary-800 grid justify-items-center"
                >
                    <Fa icon={faTwitter} size="20" />
                </a>
                <a
                    href="https://www.instagram.com/"
                    class="items-center w-8 h-8 p-1 rounded-full hover:bg-primary-800 grid justify-items-center"
                >
                    <Fa icon={faInstagram} size="20" />
                </a>
                <a
                    href="https://www.linkedin.com/"
                    class="items-center w-8 h-8 p-1 rounded-full hover:bg-primary-800 grid justify-items-center"
                >
                    <Fa icon={faLinkedinIn} size="20" />
                </a>
            </div>
        </div>
    </div>
    <!-- Logo and Social Media Bar (Above) -->

    <hr class="!border-t-1 !border-gray-600 my-4" />

    <!-- Only visible for sm brekpoint or below -->
    <!-- Contact Us Box (Below) -->
    <div class="pt-2 pb-4 sm:hidden grid grid-flow-row">
        <p class="pb-2 pl-4 font-semibold uppercase">Get In Touch</p>
        <p class="pl-4">Don't worry, we don't send spam.</p>
        <div class="relative mt-2">
            <div class="flex">
                <input
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    class="input rounded-r-none rounded-l-full w-full placeholder-surface-500 !border-0 !bg-surface-100"
                    required
                />
                <button
                    aria-label="Submit Email Address"
                    type="button"
                    class="font-medium rounded-l-none rounded-r-full btn variant-filled-secondary"
                    >Submit</button
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
                            <li><a href="/">Contact Us</a></li>
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
                            <li><a href="/">FAQs</a></li>
                            <li><a href="/">Dashboard</a></li>
                            <li><a href="/">Contact</a></li>
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
        class="hidden md:grid grid-flow-col grid-cols-3 lg:grid-cols-4 grid-rows-[1fr_auto] lg:grid-rows-1 font-light text-md justify-items-center gap-y-8"
    >
        <!-- CATEOGIRIES -->
        <div class="row-start-1 row-end-2">
            <h4 class="pb-2 uppercase h4 grid">Categories</h4>
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
            <h4 class="pb-2 uppercase h4 grid">About</h4>
            <ul class="grid gap-y-1">
                <li><a href="/about">About Us</a></li>
                <li><a href="/">Learner Stories</a></li>
                <li><a href="/">Careers</a></li>
                <li><a href="/">Press</a></li>
                <li><a href="/">Leadership</a></li>
                <li><a href="/">Contact Us</a></li>
            </ul>
        </div>
        <!-- SUPPORT -->
        <div class="row-start-1 row-end-2">
            <h4 class="pb-2 uppercase h4 grid">Support</h4>
            <ul class="grid gap-y-1">
                <li><a href="/">Documentation</a></li>
                <li><a href="/">FAQs</a></li>
                <li><a href="/">Dashboard</a></li>
                <li><a href="/">Contact</a></li>
            </ul>
        </div>

        <!-- Contact Us Box (Below) -->
        <div
            class="row-start-2 row-span-1 col-start-1 col-span-2 lg:row-start-1 lg:col-start-4 lg:col-span-1 justify-self-start"
        >
            <p class="pb-2 pl-4 font-semibold uppercase">Get In Touch</p>
            <p class="pl-4">Don't worry, we don't send spam.</p>
            <div class="relative mt-2">
                <div class="flex">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email Address"
                        class="input rounded-r-none rounded-l-full w-full placeholder-surface-400 !border-0 !bg-surface-100 text-surface-600"
                        required
                    />
                    <button
                        aria-label="Submit Email Address"
                        type="button"
                        class="font-medium rounded-l-none rounded-r-full btn variant-filled-secondary active:scale-100"
                        >Submit</button
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
    <div class="absolute bottom-0 w-full h-64 bg-gray-800 -z-10" />
{/if}
