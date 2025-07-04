<script lang="ts">
    import type { CourseResult } from '$lib/api/types/courses';
    import type { ToggleCourseFavoritePayload } from '$lib/models/types/toggle-user-course-favorite-event';

    import { Button } from '$lib/components/ui/button';
    import CourseRating from '$lib/components/course-rating.svelte';
    import Fa from 'svelte-fa';
    import { faHeart } from '@fortawesome/free-solid-svg-icons';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import { onMount } from 'svelte';
    import { Separator } from '$lib/components/ui/separator';

    interface Props {
        courseResult: CourseResult;
        toggleFavorite: (payload: ToggleCourseFavoritePayload) => void;
    }

    const { courseResult, toggleFavorite }: Props = $props();

    let toggled = $state(false);
    onMount(() => {
        toggled = courseResult.course.isFavorite ?? false;
    });

    const toggle = () => {
        toggled = !toggled;

        const payload = {
            courseId: courseResult.course.id,
            current: toggled,
            previous: !toggled
        };

        toggleFavorite(payload);
    };
</script>

<div class="grid grid-flow-row grid-cols-[minmax(150px,_1fr)_3fr] items-center gap-x-2">
    <div class="relative w-full self-start sm:self-center" style="padding-top: 100%;">
        <!-- This padding top keeps the aspect ratio 1:1 -->
        <a href={`/courses/${courseResult.course.id}`}>
            <img
                alt="Course Thumbnail"
                class="absolute inset-0 h-full w-full rounded-lg object-cover"
                src={courseResult.course.imgHref}
            />
        </a>
    </div>

    <div
        class="grid md:grid-cols-[1fr_auto_auto] md:grid-rows-[1fr_auto_auto] md:gap-x-2"
        data-testid="list-item-center-col"
    >
        <div>
            <CourseRating
                rating={courseResult.course.ratingAverage}
                ratingCount={courseResult.course.ratingCount}
            />
            <Button class="m-0 p-0" href={`/courses/${courseResult.course.id}`} variant="link">
                <h2 class="line-clamp-1 font-bold sm:text-lg">
                    {courseResult.course.title}
                </h2>
            </Button>
            <p class="line-clamp-1 text-sm sm:line-clamp-2 md:line-clamp-3">
                {courseResult.course.description}
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
                        >${Math.round(courseResult.course.originalPrice * 100) / 100}</span
                    >
                    <span class="m-0 p-0 text-lg font-bold"
                        >${Math.round(courseResult.course.currentPrice * 100) / 100}</span
                    >
                </div>
                <div
                    class="col-span-full col-start-1 row-start-2 flex items-center justify-end gap-x-2 pl-2 sm:col-span-1 sm:row-span-full md:col-span-full md:row-span-1 md:row-start-2"
                    data-testid="list-item-button-block"
                >
                    <button onclick={toggle}>
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
