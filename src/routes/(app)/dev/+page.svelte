<script lang="ts">
    import * as Sheet from '$lib/components/ui/sheet';
</script>

<div class="grid grid-flow-row p-5">
    <h1 class="pb-10 text-2xl font-medium">Currently In Development</h1>

    <div class="border border-dashed border-pink-500 p-4">
        <!-- ENTER CODE BELOW -->
        <Sheet.Root>
            <Sheet.Trigger>Open</Sheet.Trigger>
            <Sheet.Content>
                <Sheet.Header>
                    <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
                    <Sheet.Description>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                    </Sheet.Description>
                </Sheet.Header>
            </Sheet.Content>
        </Sheet.Root>

        <!-- ENTER CODE ABOVE -->
    </div>
</div>
