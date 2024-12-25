import { initClient, setExample, connectWorker } from './client';
import { initServer } from './server';
import rbs_user from './examples/user.rbs?raw';
import rb_hello from './examples/hello.rb?raw';
import rb_explicit from './examples/explicit.rb?raw';
import rb_union from './examples/union.rb?raw';
import rb_array from './examples/array.rb?raw';
import rb_tuple from './examples/array.rb?raw';
import rbs_interface from './examples/interface.rbs?raw';
import rb_interface from './examples/interface.rb?raw';


const examples = {
    "hello": [rb_hello, rbs_user],
    "explicit": [rb_explicit, rbs_user],
    "union": [rb_union, "# No RBS"],
    "array": [rb_array, "# No RBS"],
    "tuple": [rb_tuple, "# No RBS"],
    "interface": [rb_interface, rbs_interface],
};

const encodeState = (rb:string, rbs:string) => {
    const params = new URLSearchParams();
    params.append("rb", rb);
    params.append("rbs", rbs);
    return params.toString();
};

const decodeState = (encoded: string) => {
    const params = new URLSearchParams(encoded);
    const rb = params.get("rb") || "";
    const rbs = params.get("rbs") || "";
    return { rb, rbs };
};

const rbEditor = document.getElementById('rb-editor')!;
const rbsEditor = document.getElementById('rbs-editor')!;
await initClient(rbEditor, rbsEditor, (rb, rbs) => {
    window.location.hash = encodeState(rb, rbs);
});

const fragment = window.location.hash;
if (fragment.length <= 1) {
    setExample(rb_hello, rbs_user);
}
else {
    const { rb, rbs } = decodeState(fragment.substring(1));
    setExample(rb, rbs);
}

const exampleSelector = document.getElementById("select-example")! as HTMLSelectElement;

exampleSelector.addEventListener("change", () => {
    const [rb, rbs] = examples[exampleSelector.value as keyof typeof examples];
    setExample(rb, rbs);
    window.location.hash = "";
});

initServer(
    (step: string, event: "started" | "finished") => {
        document.getElementById(step)!.classList.add(event);
    },
    (worker: Worker) => {
        worker.addEventListener("error", () => {
            document.getElementById("error")!.classList.add("active");
        });
        connectWorker(worker);
        document.getElementById("main")!.classList.add("ready");
    },
)