<script lang="ts">
    import type { PageServerData } from './$types';
    import type { ToastSettings } from '@skeletonlabs/skeleton';
    import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';
    import { faEnvelope, faPhone, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import { formatPhoneNumber, initials as getInitials } from '$lib/client/util';
    import Avatar from '$lib/components/avatar.svelte';

    export let originalData: PageServerData;
    export let data: PageServerData;

    const toastStore = getToastStore();
    $: phone = formatPhoneNumber((data.user.area_code ?? '') + (data.user.phone_number ?? ''));
    let profileImgInput: HTMLInputElement;

    let editMode = false;
    let isLoading = false;

    const errorToast: ToastSettings = {
        message: 'There was an error saving your changes.',
        background: 'bg-error-500',
        classes: 'text-white'
    };

    const successToast: ToastSettings = {
        message: 'Your changes have been saved.',
        background: 'bg-success-600'
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
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            country_code: '+1',
            area_code: phoneTemp.slice(0, 3) === '' ? null : phoneTemp.slice(0, 3),
            phone_number: phoneTemp.slice(3, 10) === '' ? null : phoneTemp.slice(3, 10),
            bio: data.user.bio === '' ? null : data.user.bio,
            city: data.user.city === '' ? null : data.user.city,
            state: data.user.state === '' ? null : data.user.state,
            photo_url: data.user.photo_url === '' ? null : data.user.photo_url
        };

        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user
            })
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
            let image = event.currentTarget.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                const formData = new FormData();
                formData.append('profile_photo', image);
                formData.append('user_id', data.user.id);

                const response = await fetch('/api/user/photo', {
                    method: 'POST',
                    body: formData
                });

                if (response.status === 200) {
                    const data = await response.json();
                    const profile_url = data.url;

                    data.user.photo_url = profile_url;
                }
            };
        }
    };

    $: initials = getInitials(data.user.name);
</script>

<div class="grid items-center justify-items-center md:p-6">
    <div
        class="container grid max-w-sm grid-flow-row p-6 bg-white shadow card gap-y-4 md:max-w-5xl"
    >
        <!-- Name Block -->
        <div class="grid justify-items-center">
            <div
                class="grid grid-flow-row items-center justify-items-center md:grid-flow-col md:justify-items-start md:grid-cols-[auto_1fr] gap-x-2"
            >
                <input
                    type="file"
                    bind:this={profileImgInput}
                    on:change={(event) => {
                        onFileSelected(event);
                    }}
                    accept=".jpg, .jpeg, .png"
                    style="display: none;"
                />
                <Avatar
                    {initials}
                    photoUrl="images/home-image-2-optimized.webp"
                    editFunction={() => {
                        profileImgInput.click();
                    }}
                />

                <h1 class="text-2xl font-bold">{data.user.name}</h1>
            </div>
        </div>
        <div class="hidden md:block">
            <hr class="min-w-full mt-4" />
        </div>

        <div class="grid grid-rows-2 md:grid-cols-2 gap-x-4 gap-y-4 md:gap-y-0">
            <!-- Email -->
            <div class="grid items-center min-w-full text-gray-500">
                <div class="relative min-w-full">
                    <Fa
                        icon={faEnvelope}
                        class="absolute text-gray-400 transform -translate-y-1/2 left-2 top-1/2"
                    />
                    <input
                        disabled={!editMode}
                        name="email"
                        value={data.user.email}
                        class="w-full p-1 pl-8 text-gray-700 border rounded-md shadow-sm border-surface-50 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-surface-900 dark:border-2 dark:border-surface-700 dark:disabled:text-gray-50 dark:bg-surface-900 dark:shadow-sm dark:text-gray-200"
                    />
                </div>
            </div>

            <!-- Phone -->
            <div class="grid items-center min-w-full text-gray-500 gap-x-2">
                <div class="relative min-w-full">
                    <Fa
                        icon={faPhone}
                        class="absolute text-gray-400 transform -translate-y-1/2 left-2 top-1/2"
                    />
                    <input
                        disabled={!editMode}
                        type="tel"
                        value={phone}
                        id="phone-input"
                        maxlength="12"
                        on:input={updatePhoneNumber}
                        class="w-full p-1 pl-8 text-gray-700 border rounded-md shadow-sm border-surface-50 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-surface-900 dark:border-2 dark:border-surface-700 dark:disabled:text-gray-50 dark:bg-surface-900 dark:shadow-sm dark:text-gray-200"
                    />
                </div>
            </div>

            <div class="md:hidden">
                <hr class="min-w-full mt-4" />
            </div>

            <!-- City -->
            <div class="min-w-full">
                <p class="h-auto font-bold text-gray-600 dark:text-gray-400">City</p>
                <input
                    disabled={!editMode}
                    bind:value={data.user.city}
                    id="phone-input"
                    class="w-full p-1 pl-2 text-gray-700 border rounded-md shadow-sm border-surface-50 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-surface-900 dark:border-2 dark:border-surface-700 dark:disabled:text-gray-50 dark:bg-surface-900 dark:shadow-sm dark:text-gray-200"
                />
            </div>

            <!-- State -->
            <div class="min-w-full">
                <p class="h-auto font-bold text-gray-600 dark:text-gray-400">State</p>
                <input
                    disabled={!editMode}
                    bind:value={data.user.state}
                    id="phone-input"
                    class="w-full p-1 pl-2 text-gray-700 border rounded-md shadow-sm border-surface-50 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-surface-900 dark:border-2 dark:border-surface-700 dark:disabled:text-gray-50 dark:bg-surface-900 dark:shadow-sm dark:text-gray-200"
                />
            </div>
        </div>

        <div class="grid items-center grid-flow-row gap-y-1 justify-items-center">
            <!-- Bio -->
            <div
                class="grid grid-flow-col grid-cols-[auto_1fr] items-center gap-x-2 text-gray-500 min-w-full"
            >
                <div class="min-w-full">
                    <p class="h-auto font-bold text-gray-600 dark:text-gray-400">Bio</p>
                    <textarea
                        disabled={!editMode}
                        bind:value={data.user.bio}
                        id="phone-input"
                        class="w-full h-24 min-w-full p-1 pl-2 text-gray-700 border rounded-md shadow-sm resize-none border-surface-50 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-surface-900 dark:border-2 dark:border-surface-700 dark:disabled:text-gray-50 dark:bg-surface-900 dark:shadow-sm dark:text-gray-200"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="grid w-full px-4 justify-items-end max-w-screen-xs md:max-w-5xl">
        {#if editMode}
            <div class="grid items-center grid-flow-col gap-x-2 justify-self-end">
                <button
                    aria-label="Cancel Changes"
                    class="mt-4 text-gray-700 btn btn-sm justify-self-end dark:text-gray-500"
                    on:click={cancelChanges}
                >
                    Cancel
                </button>
                <button
                    disabled={isLoading}
                    aria-label="Save Changes"
                    class="grid items-center grid-flow-col mt-4 btn btn-sm variant-filled-primary justify-self-end gap-x-2"
                    on:click={saveChanges}
                >
                    {#if isLoading}
                        <ProgressRadial width="w-6" stroke={100} />
                    {/if}
                    Save Changes
                </button>
            </div>
        {:else}
            <button
                aria-label="Edit Profile"
                class="mt-4 btn btn-sm variant-soft justify-self-end"
                on:click={() => {
                    editMode = !editMode;
                }}
            >
                <Fa icon={faPenToSquare} class="mr-2" />
                Edit Profile
            </button>
        {/if}
    </div>
</div>
