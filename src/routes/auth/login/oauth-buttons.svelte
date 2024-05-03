<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa';
</script>

<div class="grid grid-flow-row gap-y-3">
    <Button aria-label="Sign in with Google" class="flex gap-2" type="button" variant="outline">
        <Fa icon={faGoogle} size="lg" />
        <span>Sign in with Google</span>
    </Button>

    <Button aria-label="Sign in with Facebook" class="flex gap-2" type="button" variant="outline">
        <Fa icon={faFacebook} size="lg" />
        <span>Sign in with Facebook</span>
    </Button>

    <Button aria-label="Sign in with Apple" class="flex gap-2" type="button" variant="outline">
        <Fa icon={faApple} size="lg" />
        <span>Sign in with Apple</span>
    </Button>
</div>
