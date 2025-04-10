<script lang="ts">
    import type { FaqProps } from './faq-models';

    import {
        faBookOpen,
        faChalkboardTeacher,
        faTools,
        faUsers
    } from '@fortawesome/free-solid-svg-icons';

    import * as Accordion from '$lib/components/ui/accordion/index';

    import Fa from 'svelte-fa';
    import sanitizeHtml from 'sanitize-html';

    const aboutUsLink =
        'https://imagedelivery.net/06fAhz9XSvNypOfNBz1x-Q/85137f90-0f2d-492f-ee79-0425c18e3e00/public';
    const aboutUsAlt = 'three people sitting in front of table laughing togeter';

    const faqs: FaqProps[] = [
        {
            question: 'What is StudyStack?',
            icon: faBookOpen,
            answer: `
                <p>StudyStack is an open-source starter kit for building online learning platforms. It includes core features like course creation, lesson delivery, and user management — designed to give developers a strong foundation to build on.</p>
                <p>It originally began as part of a private platform built for a now-dissolved project. Rather than let the work go to waste, it’s been restructured and de-branded as a public resource for the community.</p>
            `
        },
        {
            question: 'Is StudyStack tied to a specific organization?',
            icon: faUsers,
            answer: `
                <p>No — StudyStack is a completely independent open-source project. It’s not affiliated with any company, church, or educational institution. It’s offered as-is, for anyone who wants to use it, fork it, or contribute to it.</p>
            `
        },
        {
            question: 'Who is StudyStack for?',
            icon: faChalkboardTeacher,
            answer: `
                <p>StudyStack is for developers, educators, and creators who want to build their own learning platform without starting from scratch. Whether you're building an internal training tool, a course site for your audience, or experimenting with edtech ideas, this project gives you a flexible jumping-off point.</p>
            `
        },
        {
            question: 'Is this a fully maintained platform?',
            icon: faTools,
            answer: `
                <p>Not quite — this is more of a proof-of-concept and codebase you can build on, rather than a full SaaS platform. It’s provided as a template and demo project, with no long-term roadmap or guaranteed updates.</p>
                <p>That said, pull requests and contributions are welcome if you find it useful and want to help it grow!</p>
            `
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
                StudyStack started as part of a private platform, but after that project came to an
                end, the work was reimagined as an open-source starter kit for learning platforms.
                It’s maintained as a personal side project and is meant to serve as a flexible
                foundation for others who want to build and customize their own educational tools.
                The goal isn’t to run a full product — it’s to share something useful with the
                community.
            </p>
        </section>

        <!-- WHO THIS IS FOR -->
        <aside class="col-span-1">
            <h2 class="h2">Who</h2>
            <h4 class="h4 pl-6 text-gray-600 dark:text-gray-400">this is for</h4>
        </aside>

        <section class="col-span-3">
            <p>
                StudyStack is built for developers, educators, and creators who want to build and
                deliver educational content online. Whether you're creating internal training tools,
                teaching a course to your audience, or exploring new ideas in edtech, this project
                offers a flexible and modern foundation to start from.
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
    </div>
</div>
