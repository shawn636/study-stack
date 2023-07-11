<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="items-center w-full h-full grid justify-items-center">
    <div class="p-10 card space-y-4">
        <h1 class="h1 text-7xl text-warning-600 dark:text-warning-500">404</h1>

        <h2 class="h2">
            <span class="font-semibold text-error-500">Oops!</span> Page {$page.error?.message}
        </h2>
        <p>The page you’re looking for doesn’t exist.</p>
        <a href="/" class="w-full btn variant-filled">Go home</a>
    </div>
</div>
