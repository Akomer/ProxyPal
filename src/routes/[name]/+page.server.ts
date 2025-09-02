import config from '../../../config.json';

type ServersConfig = { servers: { name: string; url: string }[] };

export const load = ({ params }: { params: { name: string } }) => {
	const { servers } = config as ServersConfig;
	const selectedServer = servers.find((s) => s.name === params.name);

	return {
		servers,
		selectedServerName: selectedServer?.name ?? servers[0]?.name ?? '',
		name: params.name
	};
};
