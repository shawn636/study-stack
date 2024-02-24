<!-- eslint-disable -->
<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';
    import { faBookBible, faChalkboardTeacher, faChurch } from '@fortawesome/free-solid-svg-icons';
    import type { FaqProps } from './faq-models';

    const aboutUsLink =
        'https://imagedelivery.net/06fAhz9XSvNypOfNBz1x-Q/85137f90-0f2d-492f-ee79-0425c18e3e00/public';
    const aboutUsAlt = 'three people sitting in front of table laughing togeter';

    const btm_link = 'https://www.bethemessagenow.com';
    const pastor_jeff_link = 'https://go.jeffcarver.com/';

    const faqs: FaqProps[] = [
        {
            icon: faBookBible,
            question: 'What is Equipped?',
            answer: '<p>Equipped is a platform that provides resources and tools to help people grow in their faith and deepen their relationship with God. We are passionate about helping people grow in their faith and equipping them to live out their faith in their everyday lives.</p>'
        },
        {
            icon: faChurch,
            question: 'Is Equipped associated with a specific church?',
            answer: `<p>We aren't directly affiliated with a specific church, though both of the founders belong to the same local body in Southern California. Pastor <a href="${pastor_jeff_link}" style="text-decoration: underline;">Jeff Carver</a> is the administrative leader of Equipped and a senior pastor at <a href="${btm_link}" style="text-decoration: underline">Be the Message Church</a>.</p>`
        },
        {
            icon: faChalkboardTeacher,
            question: 'Who can teach on Equipped?',
            answer: "<p>We believe that the body of Christ is diverse and that there are many voices that have something to offer. We are open to having a variety of teachers and speakers on our platform, however we do require that teachers on our platform align with our statement of faith. We would like to be an inclusive platform that's open to as many teachers as possible, but we also want to be a platform that's committed to the truth of the Gospel as expressed in Scripture.</p>"
        }
    ];
</script>

<div class="w-full grid justify-items-center">
    <div class="p-5 grid grid-cols-4 gap-y-10 max-w-2xl">
        <div class="row-span-1 text-center col-span-full">
            <h1 class="text-4xl font-bold">About Us</h1>
        </div>

        <img
            src={aboutUsLink}
            alt={aboutUsAlt}
            class="col-span-full justify-self-center object-top w-full object-cover h-64 rounded-md"
        />
        <aside class="col-span-1">
            <h2 class="h2">Who</h2>
            <h4 class="h4 text-gray-600 dark:text-gray-400 pl-6">we are</h4>
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

        <aside class="col-span-1">
            <h2 class="h2">Who</h2>
            <h4 class="h4 text-gray-600 dark:text-gray-400 pl-6">this is for</h4>
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

        <h2 class="h2 col-span-full text-center">Frequently Asked Questions</h2>

        <Accordion class="col-span-full" autocollapse>
            {#each faqs as faq}
                <AccordionItem>
                    <svelte:fragment slot="lead">
                        <Fa icon={faq.icon} class="text-primary" size="lg" />
                    </svelte:fragment>
                    <svelte:fragment slot="summary"
                        ><h4 class="font-semibold">{faq.question}</h4></svelte:fragment
                    >
                    <svelte:fragment slot="content">
                        <!-- @html is safe here because the content is defined as a static object -->
                        <!-- Using @html at all here is simply a way of cleaning up the code -->
                        <!-- When svelte compiles this, the @html will basically disappear -->

                        <!-- eslint-disable svelte/no-at-html-tags -->
                        {@html faq.answer}
                        <!-- eslint-disable svelte/no-at-html-tags -->
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>
    </div>
</div>
