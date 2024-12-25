import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";
import bootstrap from './bootstrap.rb?raw';

const step = async <X>(step: string, body: () => X) => {
	postMessage({ type: "progress", step, event: "started" });
	const ret = await body();
	postMessage({ type: "progress", step, event: "finished" });
	return ret;
};

const wasmModule = await step("progress-load-wasm", async () => {
	const wasmUrl = new URL('../public/ruby.wasm', import.meta.url);
	const wasmData = await fetch(wasmUrl);
	return WebAssembly.compileStreaming(wasmData);
});
const { vm } = await step("progress-init-wasm", async () => DefaultRubyVM(wasmModule));
await vm.evalAsync(`PRODUCTION = ${import.meta.env.PROD ? "true" : "false"}`);
const server = await step("progress-load-typeprof", async () => vm.evalAsync(bootstrap));
await step("progress-init-typeprof", async () => server.callAsync("setup"));
await step("progress-start-typeprof", async () => server.callAsync("start", vm.wrap((str: string) => postMessage(JSON.parse(str)))));

onmessage = async (event) => {
	try {
		await server.callAsync("add_msg", vm.wrap(JSON.stringify(event.data)));
	}
	catch (e) {
		self.reportError(e);
	}
};
postMessage({ type: "ready" });