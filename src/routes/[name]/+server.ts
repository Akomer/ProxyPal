import type { RequestHandler } from '@sveltejs/kit';
import config from '../../../config.json';

type ServersConfig = { servers: { name: string; url: string }[] };
const cfg = config as ServersConfig;

const proxyRequest: RequestHandler = async ({ params, request, url }) => {
	const serverConfig = cfg.servers?.find((s) => s.name === params.name);

	if (!serverConfig) {
		return new Response('Proxy target not found in config', { status: 404 });
	}

	const targetUrl = new URL(serverConfig.url);
	targetUrl.pathname = url.pathname.replace(`/${params.name}`, '');
	targetUrl.search = url.search;

	try {
		const response = await fetch(targetUrl.toString(), {
			method: request.method,
			headers: request.headers,
			body: request.body,
			duplex: 'half'
		} as any);

		return response;
	} catch (error) {
		console.error('Proxy request failed:', error);
		return new Response('Proxy request failed', { status: 502 });
	}
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
