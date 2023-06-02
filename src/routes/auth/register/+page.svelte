<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';

	let name = '';
	let email = '';
</script>

<div class="text-center w-64">
	<div class="py-5">
		<h1 class="h1 font-semibold">Welcome</h1>
		<p class="text-xs text-slate-500">Please enter your details below</p>
	</div>
	<form>
		<div class="grid grid-flow-row text-md gap-y-4">
			<input type="text" placeholder="Name" bind:value={name} class="input" />
			<input type="email" placeholder="Email" bind:value={email} class="input" />
			<button class="btn variant-filled-secondary font-medium">Continue</button>
		</div>

		<div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
			<hr />
			<p class="text-sm px-2 font-semibold uppercase text-surface-500 dark:text-surface-400">or</p>
			<hr />
		</div>

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
	</form>
	<p class="text-sm py-2 text-slate-500">
		Already have an account? <a
			class="text-primary-500 font-semibold hover:text-primary-600"
			href="/auth/login">Sign in</a
		>
	</p>
</div>
