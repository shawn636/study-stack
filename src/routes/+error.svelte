<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="grid justify-items-center items-center h-full w-full">
    <div class="card p-10 space-y-4">
        <h1 class="h1 text-7xl text-warning-600 dark:text-warning-500">404</h1>

        <h2 class="h2">
            <span class="text-error-500 font-semibold">Oops!</span> Page {$page.error?.message}
        </h2>
        <p>The page you’re looking for doesn’t exist.</p>
        <a href="/" class="btn variant-filled w-full">Go home</a>
    </div>
</div>
