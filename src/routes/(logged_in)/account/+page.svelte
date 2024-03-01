<script lang="ts">
    import type { ToastSettings } from '@skeletonlabs/skeleton';

    import { formatPhoneNumber, initials as getInitials } from '$lib/client/util';
    import Avatar from '$lib/components/avatar.svelte';
    import { faEnvelope, faPenToSquare, faPhone } from '@fortawesome/free-solid-svg-icons';
    import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';

    import type { PageServerData } from './$types';

    export let originalData: PageServerData;
    export let data: PageServerData;

    const toastStore = getToastStore();
    $: phone = formatPhoneNumber((data.user.area_code ?? '') + (data.user.phone_number ?? ''));
    let profileImgInput: HTMLInputElement;

    let editMode = false;
    let isLoading = false;

    const errorToast: ToastSettings = {
        background: 'bg-error-500',
        classes: 'text-white',
        message: 'There was an error saving your changes.'
    };

    const successToast: ToastSettings = {
        background: 'bg-success-600',
        message: 'Your changes have been saved.'
    };

    onMount(() => {
        originalData = data;
    });

    const updatePhoneNumber = (
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
        const inputNumber = event.currentTarget.value;
        phone = formatPhoneNumber(inputNumber);
        event.currentTarget.value = phone;
    };

    const cancelChanges = () => {
        data = originalData;
        editMode = false;
    };

    const saveChanges = async () => {
        isLoading = true;

        const phoneTemp = phone.replace(/\s/g, '');

        const user = {
            area_code: phoneTemp.slice(0, 3) === '' ? null : phoneTemp.slice(0, 3),
            bio: data.user.bio === '' ? null : data.user.bio,
            city: data.user.city === '' ? null : data.user.city,
            country_code: '+1',
            email: data.user.email,
            id: data.user.id,
            name: data.user.name,
            phone_number: phoneTemp.slice(3, 10) === '' ? null : phoneTemp.slice(3, 10),
            photo_url: data.user.photo_url === '' ? null : data.user.photo_url,
            state: data.user.state === '' ? null : data.user.state
        };

        const response = await fetch('/api/user', {
            body: JSON.stringify({
                user
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        if (response.status === 200) {
            originalData = data;

            const phoneTemp = phone.replace(/\s/g, '');
            originalData.user.area_code = phoneTemp.slice(0, 3);
            originalData.user.phone_number = phoneTemp.slice(3, 10);
            isLoading = false;
            toastStore.trigger(successToast);

            isLoading = false;
            editMode = !editMode;
        } else {
            isLoading = false;
            toastStore.trigger(errorToast);
        }
    };

    const onFileSelected = async (
        event: Event & { currentTarget: EventTarget & HTMLInputElement }
    ) => {
        if (event.currentTarget && event.currentTarget.files) {
            const image = event.currentTarget.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                const formData = new FormData();
                formData.append('profile_photo', image);
                formData.append('user_id', data.user.id);

                const response = await fetch('/api/user/photo', {
                    body: formData,
                    method: 'POST'
                });

                if (response.status === 200) {
                    const data = await response.json();
                    const profileUrl = data.url;

                    data.user.photo_url = profileUrl;
                }
            };
        }
    };

    $: initials = getInitials(data.user.name);
</script>

<div class="grid items-center justify-items-center md:p-6">
    <div
        class="card container grid max-w-sm grid-flow-row gap-y-4 bg-white p-6 shadow md:max-w-5xl"
    >
        <!-- Name Block -->
        <div class="grid justify-items-center">
            <div
                class="grid grid-flow-row items-center justify-items-center gap-x-2 md:grid-flow-col md:grid-cols-[auto_1fr] md:justify-items-start"
            >
                <input
                    accept=".jpg, .jpeg, .png"
                    bind:this={profileImgInput}
                    on:change={(event) => {
                        onFileSelected(event);
                    }}
                    style="display: none;"
                    type="file"
                />
                <Avatar
                    editFunction={() => {
                        profileImgInput.click();
                    }}
                    {initials}
                    photoUrl="images/home-image-2-optimized.webp"
                />

                <h1 class="text-2xl font-bold">{data.user.name}</h1>
            </div>
        </div>
        <div class="hidden md:block">
            <hr class="mt-4 min-w-full" />
        </div>

        <div class="grid grid-rows-2 gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-0">
            <!-- Email -->
            <div class="grid min-w-full items-center text-gray-500">
                <div class="relative min-w-full">
                    <Fa
                        class="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400"
                        icon={faEnvelope}
                    />
                    <input
                        class="w-full rounded-md border border-surface-50 p-1 pl-8 text-gray-700 shadow-sm disabled:bg-gray-100 disabled:text-black dark:border-2 dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 dark:shadow-sm dark:disabled:bg-surface-900 dark:disabled:text-gray-50"
                        disabled={!editMode}
                        name="email"
                        value={data.user.email}
                    />
                </div>
            </div>

            <!-- Phone -->
            <div class="grid min-w-full items-center gap-x-2 text-gray-500">
                <div class="relative min-w-full">
                    <Fa
                        class="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400"
                        icon={faPhone}
                    />
                    <input
                        class="w-full rounded-md border border-surface-50 p-1 pl-8 text-gray-700 shadow-sm disabled:bg-gray-100 disabled:text-black dark:border-2 dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 dark:shadow-sm dark:disabled:bg-surface-900 dark:disabled:text-gray-50"
                        disabled={!editMode}
                        id="phone-input"
                        maxlength="12"
                        on:input={updatePhoneNumber}
                        type="tel"
                        value={phone}
                    />
                </div>
            </div>

            <div class="md:hidden">
                <hr class="mt-4 min-w-full" />
            </div>

            <!-- City -->
            <div class="min-w-full">
                <p class="h-auto font-bold text-gray-600 dark:text-gray-400">City</p>
                <input
                    bind:value={data.user.city}
                    class="w-full rounded-md border border-surface-50 p-1 pl-2 text-gray-700 shadow-sm disabled:bg-gray-100 disabled:text-black dark:border-2 dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 dark:shadow-sm dark:disabled:bg-surface-900 dark:disabled:text-gray-50"
                    disabled={!editMode}
                    id="phone-input"
                />
            </div>

            <!-- State -->
            <div class="min-w-full">
                <p class="h-auto font-bold text-gray-600 dark:text-gray-400">State</p>
                <input
                    bind:value={data.user.state}
                    class="w-full rounded-md border border-surface-50 p-1 pl-2 text-gray-700 shadow-sm disabled:bg-gray-100 disabled:text-black dark:border-2 dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 dark:shadow-sm dark:disabled:bg-surface-900 dark:disabled:text-gray-50"
                    disabled={!editMode}
                    id="phone-input"
                />
            </div>
        </div>

        <div class="grid grid-flow-row items-center justify-items-center gap-y-1">
            <!-- Bio -->
            <div
                class="grid min-w-full grid-flow-col grid-cols-[auto_1fr] items-center gap-x-2 text-gray-500"
            >
                <div class="min-w-full">
                    <p class="h-auto font-bold text-gray-600 dark:text-gray-400">Bio</p>
                    <textarea
                        bind:value={data.user.bio}
                        class="h-24 w-full min-w-full resize-none rounded-md border border-surface-50 p-1 pl-2 text-gray-700 shadow-sm disabled:bg-gray-100 disabled:text-black dark:border-2 dark:border-surface-700 dark:bg-surface-900 dark:text-gray-200 dark:shadow-sm dark:disabled:bg-surface-900 dark:disabled:text-gray-50"
                        disabled={!editMode}
                        id="phone-input"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="grid w-full max-w-screen-xs justify-items-end px-4 md:max-w-5xl">
        {#if editMode}
            <div class="grid grid-flow-col items-center gap-x-2 justify-self-end">
                <button
                    aria-label="Cancel Changes"
                    class="btn btn-sm mt-4 justify-self-end text-gray-700 dark:text-gray-500"
                    on:click={cancelChanges}
                >
                    Cancel
                </button>
                <button
                    aria-label="Save Changes"
                    class="variant-filled-primary btn btn-sm mt-4 grid grid-flow-col items-center gap-x-2 justify-self-end"
                    disabled={isLoading}
                    on:click={saveChanges}
                >
                    {#if isLoading}
                        <ProgressRadial stroke={100} width="w-6" />
                    {/if}
                    Save Changes
                </button>
            </div>
        {:else}
            <button
                aria-label="Edit Profile"
                class="variant-soft btn btn-sm mt-4 justify-self-end"
                on:click={() => {
                    editMode = !editMode;
                }}
            >
                <Fa class="mr-2" icon={faPenToSquare} />
                Edit Profile
            </button>
        {/if}
    </div>
</div>
