<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';

	let email = '';
	let password = '';
</script>

<div class="text-center w-64">
	<div class="py-5">
		<h1 class="h1 font-semibold">Welcome back</h1>
		<p class="text-xs text-slate-500">Please enter your details below</p>
	</div>
	<form>
		<div class="grid grid-flow-row text-md gap-y-4">
			<input type="email" placeholder="Email" bind:value={email} class="input" />
			<input type="password" placeholder="Password" bind:value={password} class="input" />
			<button class="btn variant-filled-secondary font-medium">Sign in</button>
		</div>

		<div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
			<hr />
			<p class="text-sm px-2 font-semibold uppercase text-surface-500 dark:text-surface-400">or</p>
			<hr />
		</div>

		<div class="grid grid-flow-row gap-y-3">
			<button type="button" class="btn variant-soft">
				<Fa icon={faGoogle} size="20" />
				<span>Sign in with Google</span>
			</button>

			<button type="button" class="btn variant-soft">
				<Fa icon={faFacebook} size="20" />
				<span>Sign in with Facebook</span>
			</button>

			<button type="button" class="btn variant-soft">
				<Fa icon={faApple} size="20" />
				<span>Sign in with Apple</span>
			</button>
		</div>
	</form>
	<p class="text-sm py-2 text-slate-500">
		Don't have an account? <a
			class="text-primary-500 font-semibold hover:text-primary-600"
			href="/auth/register">Sign up</a
		>
	</p>
</div>
