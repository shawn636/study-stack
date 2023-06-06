<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
	import {
		faChevronLeft,
		faCircleExclamation,
		faExclamationTriangle,
		faCircleCheck
	} from '@fortawesome/free-solid-svg-icons';
	import { fly, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { createForm } from 'svelte-forms-lib';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { loginForm } from '$lib/schema/login-form';
	import type { PageData } from './$types';

	export let data: PageData;

	// Form Validation
	const { form, errors, validateField, touched, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: loginForm,
		onSubmit: async (values) => {
			validateField('email');
			validateField('password');

			isSubmitting = true;
			submissionError = null;
			const res = await submitForm(values);
			isSubmitting = false;

			if (res) {
				const data = await res.json();

				if (res?.status == 200) {
					showSuccess = true;
					goto('/');
				} else {
					submissionError = data.error.message;
					console.log(data.error.message);
				}
			} else {
				submissionError = 'An error occurred. Please try again.';
			}
		}
	});

	let showSuccess = false;
	let isSubmitting = false;
	let submissionError: string | null = null;

	const submitForm = async (
		values: {
			email: string;
			password: string;
		} | null
	) => {
		if (values) {
			const formData = new FormData();
			formData.append('email', values.email);
			formData.append('password', values.password);

			const res = await fetch('/auth/login', {
				method: 'POST',
				body: formData,
				headers: {
					'x-csrf-token': data.csrf_token ?? ''
				}
			});

			return res;
		}

		return null;
	};

	// Form Transitions
	const transitionDuration = 300;
</script>

<form class="h-full grid items-center w-full" id="register-form" on:submit={handleSubmit}>
	<div
		class="grid justify-items-center items-center h-full row-start-1 row-end-2 col-start-1 col-end-2"
		id="main"
		in:fly={{
			x: '100%',
			duration: transitionDuration,
			delay: transitionDuration,
			easing: cubicInOut
		}}
		out:fly={{
			x: '-100%',
			duration: transitionDuration,
			easing: cubicInOut
		}}
	>
		<div class="grid items-center">
			<a
				href="/"
				class="btn btn-iconn text-surface-700 dark:text-surface-300 justify-start flex items-center text-center gap-1 p-1"
			>
				<Fa icon={faChevronLeft} />
				Home
			</a>
			<div class="card shadow-lg p-10 w-[360px] grid justify-items-center">
				<div class="text-center">
					<!-- Header -->
					<div class="py-5">
						<h2 class="h2 font-semibold">Welcome to Equipped</h2>
						<p class="text-xs my-2 text-slate-500">Please enter your details below</p>
					</div>

					<div class="grid grid-flow-row text-md gap-y-4">
						<div>
							<input
								type="email"
								name="email"
								placeholder="Email"
								class="input
										{$errors.email ? 'border-error-500' : ''}
										{!$errors.email && $touched.email ? 'border-success-700' : ''}"
								on:change={handleChange}
								on:blur={handleChange}
								bind:value={$form.email}
							/>
							{#if $errors.email}
								<div
									class="flex items-center gap-x-1"
									in:slide|local={{
										duration: 300,
										easing: cubicInOut
									}}
									out:slide|local={{
										duration: 300,
										easing: cubicInOut
									}}
								>
									<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
									<small class="text-error-500">{$errors.email}</small>
								</div>
							{/if}
						</div>

						<input
							type="password"
							name="password"
							placeholder="Password"
							on:change={handleChange}
							on:blur={handleChange}
							bind:value={$form.password}
							class="input
										{$errors.password ? 'border-error-500' : ''}
										{!$errors.password && $touched.password ? 'border-success-700' : ''}"
						/>
						{#if $errors.password}
							<div
								class="flex items-center gap-x-1"
								in:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
								out:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
							>
								<Fa icon={faCircleExclamation} size="16" class="text-error-500" />
								<small class="text-error-500">{$errors.password}</small>
							</div>
						{/if}
						<button
							type="submit"
							aria-label="continue"
							class="btn variant-filled-secondary font-medium"
						>
							{#if isSubmitting}
								<ProgressRadial width="w-6" stroke={100} />
							{:else}
								Submit
							{/if}
						</button>
						{#if submissionError}
							<div
								class="alert variant-ghost-error mt-4 items-center"
								in:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
								out:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
							>
								<div class="grid grid-cols-[auto_1fr] gap-x-4 w-ful h-full items-center">
									<Fa
										icon={faExclamationTriangle}
										size="16"
										class="row-start-1 row-end-2 col-start-1 col-end-2"
									/>
									<div
										class="alert-message grid items-center h-fullrow-start-1 row-end-2 col-start-2 col-end-3"
									>
										<p>{submissionError}</p>
									</div>
								</div>
							</div>
						{/if}
						{#if showSuccess}
							<div
								class="alert variant-ghost-success mt-4"
								in:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
								out:slide|local={{
									duration: 300,
									easing: cubicInOut
								}}
							>
								<Fa icon={faCircleCheck} />
								<div class="alert-message">
									<p>Login Successful</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Divider -->

					<div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
						<hr />
						<p class="text-sm px-2 font-semibold uppercase text-surface-500 dark:text-surface-400">
							or
						</p>
						<hr />
					</div>

					<!-- OAuth Buttons -->
					<div class="grid grid-flow-row gap-y-3">
						<button type="button" class="btn variant-soft">
							<Fa icon={faGoogle} size="20" />
							<span>Sign up with Google</span>
						</button>

						<button type="button" class="btn variant-soft">
							<Fa icon={faFacebook} size="20" />
							<span>Sign up with Facebook</span>
						</button>

						<button type="button" class="btn variant-soft">
							<Fa icon={faApple} size="20" />
							<span>Sign up with Apple</span>
						</button>
					</div>
					<p class="text-sm py-2 text-slate-500">
						Don't have an account? <a
							class="text-primary-500 font-semibold hover:text-primary-600"
							href="/auth/register">Sign up</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</form>
