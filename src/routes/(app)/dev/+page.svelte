<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

	let cards = [1, 2];

	let currCardIndex = 0;
	let prevCardIndex = 0;
	$: transitionTo = currCardIndex > prevCardIndex ? 'left' : 'right';

	let name = '';
	let email = '';
	let password1 = '';
	let password2 = '';

	const nextCard = () => {
		if (currCardIndex < cards.length - 1) {
			prevCardIndex = currCardIndex;
			currCardIndex++;
		}
	};
	const previousCard = () => {
		if (currCardIndex > 0) {
			prevCardIndex = currCardIndex;
			currCardIndex--;
		}
	};

	$: isDirty = (form: 1 | 2) => {
		if (form === 1) return name !== '' && email !== '';
		return name !== '' && email !== '' && password1 !== '' && password2 !== '';
	};
</script>

<div class="grid grid-flow-row p-5">
	<h1 class="text-2xl font-medium pb-10">Currently In Development</h1>
	<div class="border-pink-500 border border-dashed grid justify-items-start">
		<!-- ENTER CODE BELOW -->
		<div class="grid justify-items-center items-center w-full space-y-4">
			<!-- Controls -->
			<div class="grid grid-cols-2 justify-items-center items-center gap-2">
				<button
					disabled={currCardIndex === 0}
					on:click={previousCard}
					type="button"
					class="btn btn-icon rounded-lg variant-filled-surface"
				>
					<Fa icon={faAngleLeft} size="20" />
				</button>
				<button
					disabled={currCardIndex === cards.length - 1}
					on:click={nextCard}
					type="button"
					class="btn btn-icon rounded-lg variant-filled-surface"
				>
					<Fa icon={faAngleRight} size="20" />
				</button>
			</div>

			<!-- Form Data -->
			<!-- <div class="text-start w-72">
				<h3 class="text-center">Form Data</h3>
				<p>{name !== '' ? name : 'null'}</p>
				<p>{email !== '' ? email : 'null'}</p>
				<p>{password1 !== '' ? password1 : 'null'}</p>
				<p>{password2 !== '' ? password2 : 'null'}</p>
			</div> -->

			<!-- First Form -->

			<form>
				{#if currCardIndex == 0}
					<div
						class="card p-10 space-y-4"
						in:fly={{
							x: transitionTo === 'left' ? '100%' : '-100%',
							duration: 300,
							delay: 300,
							easing: cubicInOut
						}}
						out:fly={{
							x: transitionTo === 'left' ? '-100%' : '100%',
							duration: 300,
							easing: cubicInOut
						}}
					>
						<h3 class="h3">Form 1</h3>
						<input type="text" class="input" placeholder="Name" bind:value={name} />
						<input type="email" class="input" placeholder="Email" bind:value={email} />
						<button
							type="button"
							on:click={previousCard}
							class="btn variant-filled-surface"
							disabled
						>
							Go Back
						</button>
						<button
							type="button"
							on:click={nextCard}
							class="btn variant-filled-primary"
							disabled={!isDirty(1)}
						>
							Continue
						</button>
					</div>
					<!-- Second Form -->
				{:else}
					<div
						class="card p-10 space-y-4"
						in:fly={{
							x: transitionTo === 'left' ? '100%' : '-100%',
							duration: 300,
							delay: 300,
							easing: cubicInOut
						}}
						out:fly={{
							x: transitionTo === 'left' ? '-100%' : '100%',
							duration: 300,
							easing: cubicInOut
						}}
					>
						<h3 class="h3">Form 2</h3>
						<input
							type="password"
							class="input"
							placeholder="Enter a password"
							bind:value={password1}
						/>
						<input
							type="password"
							class="input"
							placeholder="Confirm your password"
							bind:value={password2}
						/>
						<button type="button" on:click={previousCard} class="btn variant-filled-surface">
							Go Back
						</button>
						<button type="submit" class="btn btn-primary variant-filled-primary"> Submit </button>
					</div>
				{/if}
			</form>
		</div>
		<!-- ENTER CODE ABOVE -->
	</div>
</div>
