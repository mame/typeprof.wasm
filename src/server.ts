let worker: Worker;

export type ProcessMessage = { type: "ready", worker: Worker } | { type: "progress", step: string, event: "started" | "finished" };

export const initServer = (progress: (step: string, event: "started" | "finished") => void, ready: (worker: Worker) => void) => {
	worker = new Worker(new URL("typeprof.worker.js", import.meta.url), { type: 'module' });
	return new Promise((resolve) => {
		const controller = new AbortController();
		worker.addEventListener('message', (e) => {
			const msg = e.data;
			if (msg.type === "ready") {
				ready(worker)
				resolve(null);
				controller.abort();
			}
			else {
				progress(msg.step, msg.event);
			}
		}, { signal: controller.signal });
	});
};
