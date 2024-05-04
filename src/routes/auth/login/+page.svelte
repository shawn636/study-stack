<script lang="ts">
    import AuthFooter from '../auth-footer.svelte';
    import AuthHeader from '../auth-header.svelte';
    import Divider from '../divider.svelte';
    import LoginForm from './login-form.svelte';
    import OauthButtons from './oauth-buttons.svelte';
    import { createForm } from './submit-form';

    const { errors, form, handleChange, handleSubmit, touched } = createForm();
</script>

<div class="mx-auto grid w-full max-w-xl items-center justify-items-stretch">
    <div class="grid p-10">
        <AuthHeader
            headerTagline="Please enter your details below to sign in"
            headerText="Sign in"
        />
        <LoginForm {errors} {form} {handleChange} {handleSubmit} {touched} />
        <Divider />
        <OauthButtons />
        <AuthFooter href="/auth/register" linkText="Sign up" tagline="Don't have an account?" />
    </div>
</div>
