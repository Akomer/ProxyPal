<script lang="ts">
	import type { load } from './+page.server';
	type PageData = ReturnType<typeof load>;
	import * as Resizable from '$lib/components/ui/resizable';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let { data }: { data: PageData } = $props();

	let selectedMethod = $state('GET');
	let path = $state('');
	let body = $state('');
	let response = $state('');
	let selectedServer = $state(data.selectedServerName);

	const methods = ['GET', 'POST', 'PUT', 'DELETE'];

	async function sendRequest() {
		try {
			const res = await fetch(`/${selectedServer}${path}`, {
				method: selectedMethod,
				headers: {
					'Content-Type': 'application/json'
				},
				body: ['GET', 'DELETE'].includes(selectedMethod) ? undefined : body
			});
			const responseBody = await res.text();
			response = `Status: ${res.status}\n\n${responseBody}`;
		} catch (e: any) {
			response = `Error: ${e.message}`;
		}
	}
</script>

<svelte:head>
	<title>API Client - {data.name}</title>
</svelte:head>

<div class="h-screen p-4">
	<Resizable.PaneGroup direction="horizontal" class="rounded-lg border">
		<Resizable.Pane defaultSize={50}>
			<div class="flex h-full flex-col p-4 gap-4">
				<div class="flex gap-2">
					<Select.Root type="single" onValueChange={(v: string | undefined) => v && (selectedServer = v)} value={selectedServer}>
						<Select.Trigger class="w-[180px]">
							{selectedServer || 'Select a server'}
						</Select.Trigger>
						<Select.Content>
							{#each data.servers as server}
								<Select.Item value={server.name}>{server.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					<Select.Root type="single" onValueChange={(v: string | undefined) => v && (selectedMethod = v)} value={selectedMethod}>
						<Select.Trigger class="w-[100px]">
							{selectedMethod || 'Method'}
						</Select.Trigger>
						<Select.Content>
							{#each methods as method}
								<Select.Item value={method}>{method}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					<Input bind:value={path} placeholder="/path/to/resource" class="flex-1" />
				</div>

				<div class="flex-1">
					<ScrollArea class="h-full w-full rounded-md border p-4">
						<Textarea bind:value={body} placeholder="Request body..." class="h-full resize-none border-none focus:outline-none" />
					</ScrollArea>
				</div>
				<Button onclick={sendRequest}>Send Request</Button>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={50}>
			<div class="flex h-full flex-col p-4 gap-4">
				<div class="font-mono text-sm">Response</div>
				<ScrollArea class="h-full w-full rounded-md border p-4">
					<pre>{response}</pre>
				</ScrollArea>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
