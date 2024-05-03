<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="grid h-full w-full items-center justify-items-center">
    <div class="card space-y-4 p-10">
        <h1 class="h1 text-warning-600 dark:text-warning-500 text-7xl">404</h1>

        <h2 class="h2">
            <span class="text-error-500 font-semibold">Oops!</span> Page {$page.error?.message}
        </h2>
        <p>The page you’re looking for doesn’t exist.</p>
        <a class="variant-filled btn w-full" href="/">Go home</a>
    </div>
</div>
