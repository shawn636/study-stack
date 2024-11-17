<script lang="ts">
    import AuthFooter from '../auth-footer.svelte';
    import AuthHeader from '../auth-header.svelte';
    import { createForm } from './submit-form.svelte';
    import Divider from '../divider.svelte';
    import OauthButtons from './oauth-buttons.svelte';
    import { page } from '$app/stores';
    import SignUpForm from './sign-up-form.svelte';

    // Controls
    let showPassword1 = $state(false);
    let showPassword2 = $state(false);
    const { errors, form, handleChange, handleSubmit } = createForm();

    const loginHref = $page.url.searchParams.get('redirect')
        ? `/auth/login?redirect=${$page.url.searchParams.get('redirect')}`
        : '/auth/login';
</script>

<div class="mx-auto grid w-full max-w-xl items-center justify-items-stretch">
    <div class="px-10">
        <AuthHeader
            headerTagline="Please enter your details to create an account"
            headerText="Sign up"
        />
        <SignUpForm
            bind:showPassword1
            bind:showPassword2
            {errors}
            {form}
            {handleChange}
            {handleSubmit}
        />
        <Divider />
        <OauthButtons />
        <AuthFooter href={loginHref} linkText="Sign in" tagline="Already have an account?" />
    </div>
</div>
