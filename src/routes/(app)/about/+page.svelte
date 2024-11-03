<script lang="ts">
    import type { FaqProps } from './faq-models';

    import {
        faBookBible,
        faChalkboardTeacher,
        faChurch,
        faUpRightFromSquare
    } from '@fortawesome/free-solid-svg-icons';

    import * as Accordion from '$lib/components/ui/accordion/index';

    import Fa from 'svelte-fa';
    import sanitizeHtml from 'sanitize-html';

    const aboutUsLink =
        'https://imagedelivery.net/06fAhz9XSvNypOfNBz1x-Q/85137f90-0f2d-492f-ee79-0425c18e3e00/public';
    const aboutUsAlt = 'three people sitting in front of table laughing togeter';

    const btmLink = 'https://www.bethemessagenow.com';
    const pastorJeffLink = 'https://go.jeffcarver.com/';

    const faqs: FaqProps[] = [
        {
            answer: '<p>Equipped is a platform that provides resources and tools to help people grow in their faith and deepen their relationship with God. We are passionate about helping people grow in their faith and equipping them to live out their faith in their everyday lives.</p>',
            icon: faBookBible,
            question: 'What is Equipped?'
        },
        {
            answer: `<p>We aren't directly affiliated with a specific church, though both of the founders belong to the same local body in Southern California. Pastor <a href="${pastorJeffLink}" style="text-decoration: underline; ">Jeff Carver</a> is the administrative leader of Equipped and a senior pastor at <a href="${btmLink}" style="text-decoration: underline">Be the Message Church</a>.</p>`,
            icon: faChurch,
            question: 'Is Equipped associated with a specific church?'
        },
        {
            answer: "<p>We believe that the body of Christ is diverse and that there are many voices that have something to offer. We are open to having a variety of teachers and speakers on our platform, however we do require that teachers on our platform align with our statement of faith. We would like to be an inclusive platform that's open to as many teachers as possible, but we also want to be a platform that's committed to the truth of the Gospel as expressed in Scripture.</p>",
            icon: faChalkboardTeacher,
            question: 'Who can teach on Equipped?'
        }
    ];

    const sanitizeHtmlSettings = {
        allowedAttributes: {
            a: ['style', 'href']
        },
        allowedStyles: {
            a: {
                'text-decoration': [/^underline$/]
            }
        },
        allowedTags: sanitizeHtml.defaults.allowedTags
    };
</script>

<div class="grid w-full justify-items-center">
    <div class="grid max-w-2xl grid-cols-4 gap-y-10 p-5">
        <!-- TITLE -->
        <div class="col-span-full row-span-1 text-center">
            <h1 class="text-4xl font-bold">About Us</h1>
        </div>

        <!-- HEADER IMAGE -->
        <img
            alt={aboutUsAlt}
            class="col-span-full h-64 w-full justify-self-center rounded-md object-cover object-top"
            src={aboutUsLink}
        />

        <!-- WHO WE ARE -->
        <aside class="col-span-1">
            <h2 class="h2">Who</h2>
            <h4 class="h4 pl-6 text-gray-600 dark:text-gray-400">we are</h4>
        </aside>

        <section class="col-span-3">
            <p>
                We at <span class="font-semibold">Equipped</span> are a team of individuals who firmly
                believe in the transformative power of the Gospel. We are passionate about helping people
                grow in their faith and equipping them to live out their faith in their everyday lives.
                We strive to be a platform that provides resources and tools to help people grow in their
                faith and deepen their relationship with God. We want to be part of leveraging technology
                to equip the saints.
            </p>
        </section>

        <!-- WHO THIS IS FOR -->
        <aside class="col-span-1">
            <h2 class="h2">Who</h2>
            <h4 class="h4 pl-6 text-gray-600 dark:text-gray-400">this is for</h4>
        </aside>

        <section class="col-span-3">
            <p>
                We are for anyone who is looking to grow in their faith and deepen their
                relationship with God. We are for anyone who is looking for resources and tools to
                help them live out their faith in their everyday lives. We are for anyone who is
                looking to be part of a community of believers who are passionate about growing in
                their faith and equipping others to do the same.
            </p>
        </section>

        <!-- FREQUENTLY ASKED QUESTIONS -->
        <h2 class="h2 col-span-full text-center">Frequently Asked Questions</h2>

        <Accordion.Root type="single" class="col-span-full w-full">
            {#each faqs as faq, i}
                <Accordion.Item value={`faq-${i}`}>
                    <Accordion.Trigger>
                        {faq.question}
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <!-- Disabling sanitize html warning since input is sanitized -->
                        <!-- eslint-disable-next-line -->
                        {@html sanitizeHtml(faq.answer, sanitizeHtmlSettings)}
                    </Accordion.Content>
                </Accordion.Item>
            {/each}
        </Accordion.Root>

        <!-- ADDITIONAL LINKS BAR -->
        <section class="col-span-full grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2">
            <!-- LINK 1 -->
            <a
                class="relative h-48 w-64 overflow-hidden rounded-xl bg-muted transition-transform hover:-translate-y-2 hover:shadow-md"
                href="/beliefs"
            >
                <div class="space-y-4 p-4">
                    <h6 class="h5 font-bold">What We Believe</h6>
                    <p class="text-foreground">
                        Take a look at the core doctrines that we hold to and teach.
                    </p>
                </div>
                <Fa
                    class="absolute bottom-0 right-0 m-4 text-gray-400"
                    icon={faUpRightFromSquare}
                />
            </a>
            <!-- LINK 2 -->
            <a
                class="relative h-48 w-64 overflow-hidden rounded-xl bg-muted transition-transform hover:-translate-y-2 hover:shadow-md"
                href="/beliefs"
            >
                <div class="space-y-4 p-4">
                    <h6 class="h5 font-bold">What We Believe</h6>
                    <p class="dark:text-surface-300 text-foreground">
                        Take a look at the core doctrines that we hold to and teach.
                    </p>
                </div>
                <Fa
                    class="absolute bottom-0 right-0 m-4 text-gray-400"
                    icon={faUpRightFromSquare}
                />
            </a>
        </section>
    </div>
</div>

<style>
</style>
