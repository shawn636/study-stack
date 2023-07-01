<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="grid items-center p-6 justify-items-center">
    <div class="card grid grid-flow-row gap-y-8 shadow p-6 bg-white container max-w-5xl">
        <h2 class="text-lg">My Profile</h2>

        <!-- Name/Title Block -->
        <div
            class="border-2 border-surface-50 dark:border-surface-700 rounded-xl grid grid-cols-[auto_1fr_auto] grid-rows-3 p-4 gap-x-4 items-center"
        >
            <Avatar initials="JD" size="lg" class="row-span-3" />

            <h3 class="text-lg row-start-1 col-start-2">John Doe</h3>
            <p class="row-start-2 col-start-2">email@example.com</p>
            <p class="row-start-3 col-start-2">Organization</p>

            <button class="btn btn-sm variant-soft-surface row-span-3">
                <Fa icon={faPenToSquare} />
                <span>Edit</span>
            </button>
        </div>

        <!-- Personal Details Block -->
        <div
            class="border-2 border-surface-50 dark:border-surface-700 rounded-xl grid grid-cols-[1fr_1fr_auto] grid-rows-2 p-4 gap-x-4 items-center"
        >
            <div>
                <span class="text-sm text-gray-400">Full Name</span>
                <p>John Doe</p>
            </div>
            <div>
                <span class="text-sm text-gray-400">Email</span>
                <p>email@example.com</p>
            </div>
            <div>
                <span class="text-sm text-gray-400">Phone Number</span>
                <p>+1 123 456 7890</p>
            </div>

            <div>
                <span class="text-sm text-gray-400">Bio</span>
                <p>Team Manager</p>
            </div>

            <button class="btn btn-sm variant-soft-surface col-start-3 row-start-1 row-end-3">
                <Fa icon={faPenToSquare} />
                <span>Edit</span>
            </button>
        </div>

        <!-- Address Block -->
        <div
            class="border-2 border-surface-50 dark:border-surface-700 rounded-xl grid grid-cols-[1fr_1fr_auto] grid-rows-2 p-4 gap-x-4 items-center"
        >
            <div>
                <span class="text-sm text-gray-400">Country</span>
                <p>United States</p>
            </div>
            <div>
                <span class="text-sm text-gray-400">City/State</span>
                <p>Riverside, CA</p>
            </div>
            <div>
                <span class="text-sm text-gray-400">Postal Code</span>
                <p>92507</p>
            </div>

            <button class="btn btn-sm variant-soft-surface col-start-3 row-start-1 row-end-3">
                <Fa icon={faPenToSquare} />
                <span>Edit</span>
            </button>
        </div>
    </div>
</div>
