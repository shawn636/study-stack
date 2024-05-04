<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import { formatPhoneNumber, initials as getInitials } from '$lib/client/util';
    import Avatar from '$lib/components/avatar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Textarea } from '$lib/components/ui/textarea';
    import {
        faEnvelope,
        faPenToSquare,
        faPhone,
        faSpinner
    } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';
    import { toast } from 'svelte-sonner';

    import type { PageServerData } from './$types';

    export let originalData: PageServerData;
    export let data: PageServerData;

    $: phone = formatPhoneNumber((data.user?.areaCode ?? '') + (data.user?.phoneNumber ?? ''));
    let profileImgInput: HTMLInputElement;

    let editMode = false;
    let isLoading = false;

    onMount(() => {
        originalData = data;
    });

    const updatePhoneNumber = (
        event: { currentTarget: EventTarget & HTMLInputElement } & Event
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

        const user: User = {
            ...data.user,
            areaCode: phoneTemp.slice(0, 3) === '' ? null : phoneTemp.slice(0, 3),
            countryCode: '+1',
            phoneNumber: phoneTemp.slice(3, 10) === '' ? null : phoneTemp.slice(3, 10)
        };

        const response = await fetch('/api/user', {
            body: JSON.stringify({ user }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        if (response.status === 200) {
            originalData = data;

            const phoneTemp = phone.replace(/\s/g, '');
            originalData.user.areaCode = phoneTemp.slice(0, 3);
            originalData.user.phoneNumber = phoneTemp.slice(3, 10);
            isLoading = false;
            toast.success('Profile updated successfully');

            isLoading = false;
            editMode = !editMode;
        } else {
            isLoading = false;
            toast.error('An error occurred while updating your profile');
        }
    };

    const onFileSelected = async (
        event: { currentTarget: EventTarget & HTMLInputElement } & Event
    ) => {
        if (event.currentTarget && event.currentTarget.files) {
            const image = event.currentTarget.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                const formData = new FormData();
                formData.append('profilePhoto', image);
                formData.append('userId', data.user.id.toString());

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

<div class="mx-auto grid max-w-xl justify-items-center">
    <div class="grid w-full grid-flow-row justify-items-stretch gap-y-4">
        <!-- Name Block -->
        <div class="grid">
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
            <div class="grid min-w-full items-center">
                <div class="relative min-w-full">
                    <Fa
                        class="absolute left-2 top-1/2 -translate-y-1/2 transform "
                        icon={faEnvelope}
                    />
                    <Input class="pl-8" disabled={!editMode} name="email" value={data.user.email} />
                </div>
            </div>

            <!-- Phone -->
            <div class="grid min-w-full items-center gap-x-2">
                <div class="relative min-w-full">
                    <Fa
                        class="absolute left-2 top-1/2 -translate-y-1/2 transform "
                        icon={faPhone}
                    />
                    <Input
                        class="pl-8"
                        disabled={!editMode}
                        id="phone-input"
                        maxlength={12}
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
                <p class="h-auto font-bold">City</p>
                <Input bind:value={data.user.city} disabled={!editMode} id="phone-input" />
            </div>

            <!-- State -->
            <div class="min-w-full">
                <p class="h-auto font-bold">State</p>
                <Input bind:value={data.user.state} disabled={!editMode} id="phone-input" />
            </div>
        </div>

        <div class="grid grid-flow-row items-center justify-items-center gap-y-1">
            <!-- Bio -->
            <div class="grid min-w-full grid-flow-row grid-rows-[auto_1fr] items-center gap-x-2">
                <p class="font-bold">Bio</p>
                <Textarea bind:value={data.user.bio} disabled={!editMode} id="phone-input" />
            </div>
        </div>
    </div>

    <div class="grid w-full max-w-screen-xs justify-items-end px-4 md:max-w-5xl">
        {#if editMode}
            <div class="grid grid-flow-col items-center gap-x-2 justify-self-end">
                <Button
                    aria-label="Cancel Changes"
                    class="mt-4 justify-self-end "
                    on:click={cancelChanges}
                    variant="ghost"
                >
                    Cancel
                </Button>
                <Button
                    aria-label="Save Changes"
                    class="variant-filled-primary mt-4 grid grid-flow-col items-center gap-x-2 justify-self-end"
                    disabled={isLoading}
                    on:click={saveChanges}
                >
                    {#if isLoading}
                        <Fa class="animate-spin" icon={faSpinner} />
                    {/if}
                    Save Changes
                </Button>
            </div>
        {:else}
            <Button
                aria-label="Edit Profile"
                class="mt-4 justify-self-end"
                on:click={() => {
                    editMode = !editMode;
                }}
            >
                <Fa class="mr-2" icon={faPenToSquare} />
                Edit Profile
            </Button>
        {/if}
    </div>
</div>
