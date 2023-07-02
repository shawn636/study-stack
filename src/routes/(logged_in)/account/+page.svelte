<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { PageServerData } from './$types';
    import Fa from 'svelte-fa';
    import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

    export let data: PageServerData;

    $: initials = data.user.name
        .split(' ')
        .map((n) => n[0])
        .join('');

    let edit_mode = false;
    let phone = '';

    function formatPhoneNumber(event: any) {
        let input = event.target;
        let inputLength = input.value.length;
        let cursorPosition = input.selectionStart;
        let isBackspace = event.inputType === 'deleteContentBackward';

        // Remove any non-digit characters from the input
        phone = input.value.replace(/\D/g, '');

        // Restrict the input to 10 digits
        phone = phone.slice(0, 10);

        // Format the phone number with spaces or any desired formatting
        if (phone.length >= 3 && !isBackspace) {
            phone = `${phone.slice(0, 3)} ${phone.slice(3)}`;
            cursorPosition += 1; // Adjust cursor position for added space
        }

        if (phone.length >= 7 && !isBackspace) {
            phone = `${phone.slice(0, 7)} ${phone.slice(7)}`;
            cursorPosition += 1; // Adjust cursor position for added space
        }

        // Handle deletion
        if (isBackspace && phone.charAt(cursorPosition - 1) === ' ') {
            // If the previous character is a space, remove both the space and the digit
            phone = phone.slice(0, cursorPosition - 2) + phone.slice(cursorPosition);
            cursorPosition -= 1; // Adjust cursor position for removed space
        } else if (isBackspace && phone.charAt(cursorPosition) === ' ') {
            // If the next character is a space, remove only the digit
            phone = phone.slice(0, cursorPosition - 1) + phone.slice(cursorPosition);
        }

        // Update the input value with the formatted phone number
        input.value = phone;

        // Adjust cursor position based on the number of spaces
        let spacesBeforeCursor = (phone.slice(0, cursorPosition).match(/ /g) || []).length;
        let spacesAfterCursor = (phone.slice(cursorPosition).match(/ /g) || []).length;
        let adjustedCursorPosition = cursorPosition + spacesBeforeCursor - spacesAfterCursor;

        // Set cursor position
        input.setSelectionRange(adjustedCursorPosition, adjustedCursorPosition);
    }
</script>

<div class="grid items-center justify-items-center md:p-6">
    <div class="card grid grid-flow-row gap-y-4 shadow p-6 bg-white container max-w-5xl">
        <!-- Name Block -->
        <div class="grid grid-flow-row gap-y-2 items-center justify-items-center">
            <Avatar {initials} />
            <h1 class="text-2xl font-bold">{data.user.name}</h1>
            <div class="grid grid-flow-col min-w-full items-center gap-x-2 text-gray-500">
                {#if edit_mode}
                    <div class="relative">
                        <Fa
                            icon={faEnvelope}
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            name="email"
                            value={data.user.email}
                            class="pl-8 border shadow-sm rounded-md p-1 text-gray-700 min-w-full"
                        />
                    </div>
                {:else}
                    <div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
                        <Fa icon={faEnvelope} class=" text-gray-400" />
                        <p>{data.user.email}</p>
                    </div>
                {/if}
            </div>
            <div
                class="grid grid-flow-col grid-cols-[auto_1fr] items-center gap-x-2 text-gray-500 min-w-full"
            >
                {#if edit_mode}
                    <div class="relative min-w-full">
                        <input
                            type="tel"
                            value={phone}
                            id="phone-input"
                            class="border border-surface-100 shadow-sm rounded-md pl-8 p-1 text-gray-700 min-w-full"
                            on:input={formatPhoneNumber}
                        />
                    </div>
                {:else}
                    <Fa icon={faPhone} class="left-2 text-gray-400" />
                    <p class="text-gray-500">{phone}</p>
                {/if}
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-x-4">
        <button disabled class="btn btn-sm variant-soft mt-4">Cancel</button>
        <button
            class="btn btn-sm variant-filled-primary mt-4"
            on:click={() => {
                edit_mode = !edit_mode;
            }}
        >
            Edit Profile
        </button>
    </div>
</div>
