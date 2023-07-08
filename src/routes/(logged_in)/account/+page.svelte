<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { PageServerData } from './$types';
    import Fa from 'svelte-fa';
    import { faEnvelope, faPhone, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import { formatPhoneNumber } from '$lib/client/util';

    export let data: PageServerData;
    let edit_mode = false;
    let phone = formatPhoneNumber('9512158574');
    let bio = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. ';
    let city = '';
    let state = '';

    export let original_data: PageServerData;
    let original_phone = phone;
    let original_bio = bio;
    let original_city = city;
    let original_state = state;

    onMount(() => {
        original_data = data;
    });

    const updatePhoneNumber = (
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
        const inputNumber = event.currentTarget.value;
        phone = formatPhoneNumber(inputNumber);
        event.currentTarget.value = phone;
    };

    const cancelChanges = () => {
        data = original_data;

        // These are only necessary because I haven't added those fields to the db yet
        // Once they're added, all the needed data will be under data.user
        phone = original_phone;
        bio = original_bio;
        city = original_city;
        state = original_state;

        edit_mode = false;
    };

    const saveChanges = () => {
        // TODO: Call API to send changes to the server

        original_data = data;

        // These are only necessary because I haven't added those fields to the db yet
        // Once they're added, all the needed data will be under data.user
        original_phone = phone;
        original_bio = bio;
        original_city = city;
        original_state = state;

        edit_mode = !edit_mode;
    };

    $: initials = data.user.name
        .split(' ')
        .map((n) => n[0])
        .join('');
</script>

<div class="grid items-center justify-items-center md:p-6">
    <div class="card grid grid-flow-row gap-y-4 shadow p-6 bg-white container max-w-5xl">
        <!-- Name Block -->
        <div class="grid grid-flow-row gap-y-2 items-center justify-items-center">
            <Avatar {initials} />
            <h1 class="text-2xl font-bold">{data.user.name}</h1>
            <!-- Email -->
            <div class="grid grid-flow-col min-w-full items-center gap-x-2 text-gray-500">
                <div class="relative">
                    <Fa
                        icon={faEnvelope}
                        class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        disabled={!edit_mode}
                        name="email"
                        value={data.user.email}
                        class="pl-8 border shadow-sm rounded-md p-1 text-gray-700 min-w-full disabled:bg-surface-50 disabled:text-black dark:disabled:bg-surface-900 dark:disabled:border-none dark:disabled:text-gray-50 dark:bg-surface-700 dark:border-surface-900 dark:border-none dark:text-gray-200"
                    />
                </div>
            </div>
            <!-- Phone -->
            <div
                class="grid grid-flow-col grid-cols-[auto_1fr] items-center gap-x-2 text-gray-500 min-w-full"
            >
                <div class="relative min-w-full">
                    <Fa
                        icon={faPhone}
                        class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        disabled={!edit_mode}
                        type="tel"
                        value={phone}
                        id="phone-input"
                        maxlength="12"
                        on:input={updatePhoneNumber}
                        class="border border-surface-100 shadow-sm rounded-md pl-8 p-1 text-gray-700 min-w-full disabled:bg-surface-50 disabled:text-black dark:disabled:bg-surface-900 dark:disabled:border-none dark:disabled:text-gray-50 dark:bg-surface-700 dark:border-surface-900 dark:border-none dark:text-gray-200"
                    />
                </div>
            </div>
        </div>

        <hr class="min-w-full mt-4" />

        <div class="grid grid-flow-row gap-y-1 items-center justify-items-center">
            <!-- Bio -->
            <div
                class="grid grid-flow-col grid-cols-[auto_1fr] items-center gap-x-2 text-gray-500 min-w-full"
            >
                <div class="min-w-full">
                    <p class="dark:text-gray-400 text-gray-600 h-auto font-bold">Bio</p>
                    <textarea
                        disabled={!edit_mode}
                        value={bio}
                        id="phone-input"
                        class="border border-surface-100 shadow-sm rounded-md p-2 text-gray-700 min-w-full resize-none h-24 disabled:bg-surface-50 disabled:text-black dark:disabled:bg-surface-900 dark:disabled:border-none dark:disabled:text-gray-50 dark:bg-surface-700 dark:border-surface-900 dark:border-none dark:text-gray-200"
                    />
                </div>
            </div>

            <!-- City -->
            <div class="min-w-full">
                <p class="dark:text-gray-400 text-gray-600 h-auto font-bold">City</p>
                <input
                    disabled={!edit_mode}
                    value={city}
                    id="phone-input"
                    class="border border-surface-100 shadow-sm rounded-md pl-2 p-1 text-gray-700 min-w-full disabled:bg-surface-50 disabled:text-black dark:disabled:bg-surface-900 dark:disabled:border-none dark:disabled:text-gray-50 dark:bg-surface-700 dark:border-surface-900 dark:border-none dark:text-gray-200"
                />
            </div>

            <!-- State -->
            <div class="min-w-full">
                <p class="dark:text-gray-400 text-gray-600 h-auto font-bold">State</p>
                <input
                    disabled={!edit_mode}
                    value={state}
                    id="phone-input"
                    class="border border-surface-100 pl-2 shadow-sm rounded-md p-1 text-gray-700 min-w-full disabled:bg-surface-50 disabled:text-black dark:disabled:bg-surface-900 dark:disabled:border-none dark:disabled:text-gray-50 dark:bg-surface-700 dark:border-surface-900 dark:border-none dark:text-gray-200"
                />
            </div>
        </div>
    </div>

    {#if edit_mode}
        <div class="grid grid-flow-col gap-x-2 items-center justify-self-end">
            <button
                aria-label="Cancel Changes"
                class="btn btn-sm mt-4 justify-self-end text-gray-700 dark:text-gray-500"
                on:click={cancelChanges}
            >
                Cancel
            </button>
            <button
                aria-label="Save Changes"
                class="btn btn-sm variant-filled-primary mt-4 justify-self-end"
                on:click={saveChanges}
            >
                Save Changes
            </button>
        </div>
    {:else}
        <button
            aria-label="Edit Profile"
            class="btn btn-sm variant-soft mt-4 justify-self-end"
            on:click={() => {
                edit_mode = !edit_mode;
            }}
        >
            <Fa icon={faPenToSquare} class="mr-2" />
            Edit Profile
        </button>
    {/if}
</div>
