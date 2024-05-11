<script lang="ts">
    import type { Course, User } from '$lib/models/types/database.types';

    import CourseRating from '$lib/components/course-rating.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import { faHeart } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let courseWithInstructor: Course & User;

    let toggled = false;
</script>

<div class="grid grid-flow-row grid-cols-[minmax(150px,_1fr)_3fr] items-center gap-x-2">
    <div class="relative w-full self-start sm:self-center" style="padding-top: 100%;">
        <!-- This padding top keeps the aspect ratio 1:1 -->
        <img
            alt="Course Thumbnail"
            class="absolute inset-0 h-full w-full rounded-lg object-cover"
            src={courseWithInstructor.courseImgHref}
        />
    </div>

    <div
        class="grid md:grid-cols-[1fr_auto_auto] md:grid-rows-[1fr_auto_auto] md:gap-x-2"
        data-testid="list-item-center-col"
    >
        <div>
            <CourseRating
                rating={courseWithInstructor.courseRatingAverage}
                ratingCount={courseWithInstructor.courseRatingCount}
            />
            <h2 class="line-clamp-1 font-bold sm:text-lg">{courseWithInstructor.courseTitle}</h2>
            <p class="line-clamp-1 text-sm sm:line-clamp-2 md:line-clamp-3">
                {courseWithInstructor.courseDescription}
            </p>
        </div>
        <Separator class="my-2 md:hidden" orientation="horizontal" />
        <Separator class="hidden md:block" orientation="vertical" />
        <div data-testid="list-item-end-col">
            <div class="grid grid-cols-2 grid-rows-2 gap-x-2" data-testid="list-item-action-block">
                <div
                    class="col-span-full flex flex-row items-center justify-end gap-x-1 sm:row-span-full sm:justify-start md:col-span-full md:row-span-1 md:row-start-1 md:flex-col md:items-end"
                    data-test-id="list-item-price-block"
                >
                    <span class="m-0 p-0 text-sm text-muted-foreground/50 line-through"
                        >${Math.round(courseWithInstructor.courseOriginalPrice * 100) / 100}</span
                    >
                    <span class="m-0 p-0 text-lg font-bold"
                        >${Math.round(courseWithInstructor.courseOriginalPrice * 100) / 100}</span
                    >
                </div>
                <div
                    class="col-span-full col-start-1 row-start-2 flex items-center justify-end gap-x-2 pl-2 sm:col-span-1 sm:row-span-full md:col-span-full md:row-span-1 md:row-start-2"
                    data-testid="list-item-button-block"
                >
                    <button on:click={() => (toggled = !toggled)}>
                        <Fa
                            class="text-red-500"
                            icon={toggled ? faHeart : faHeartOutline}
                            size="lg"
                        />
                    </button>
                    <Button>Enroll Now</Button>
                </div>
            </div>
        </div>
    </div>
</div>
