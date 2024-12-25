import * as monaco from "monaco-editor";

import { initServices } from "monaco-languageclient/vscode/services";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-ruby-default-extension";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getConfigurationServiceOverride, { updateUserConfiguration } from "@codingame/monaco-vscode-configuration-service-override";
import { MonacoLanguageClient } from "monaco-languageclient";
import { ConsoleLogger } from "monaco-languageclient/tools";
import { LogLevel } from "vscode/services";
import { CloseAction, ErrorAction } from "vscode-languageclient";
import { useWorkerFactory } from "monaco-editor-wrapper/workerFactory";
import { BrowserMessageReader, BrowserMessageWriter } from "vscode-jsonrpc/browser";
import "./rbs-syntax-0.2.1.vsix"; // https://github.com/soutaro/vscode-rbs-syntax

let rbEditor: monaco.editor.IStandaloneCodeEditor;
let rbsEditor: monaco.editor.IStandaloneCodeEditor;
let onChange: (rb: string, rbs: string) => void;

export const initClient = async (rbEditorElement: HTMLElement, rbsEditorElement: HTMLElement, onChange_: (rb: string, rbs: string) => void) => {
	onChange = onChange_;

	const logger = new ConsoleLogger(LogLevel.Error);

	await initServices({
		serviceOverrides: {
			...getKeybindingsServiceOverride(),
			...getThemeServiceOverride(),
			...getTextmateServiceOverride(),
			...getConfigurationServiceOverride(),
		},
		workspaceConfig: {
			workspaceProvider: {
				trusted: true,
				async open() {
					window.open(window.location.href);
					return true;
				},
				workspace: {
					folderUri: monaco.Uri.from({
						scheme: "inmemory",
						path: "/workspace/",
					}),
				},
			},
		},
	}, { logger });

	updateUserConfiguration(JSON.stringify({
		"editor.experimental.asyncTokenization": true,
		"editor.guides.bracketPairsHorizontal": "active",
	}));

	monaco.languages.register({
		id: "ruby",
		extensions: [".rb"],
		aliases: ["Ruby", "rb"],
	});

	const TextEditorWorker = () => new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url), { type: "module" });
	const TextMateWorker = () => new Worker(new URL("@codingame/monaco-vscode-textmate-service-override/worker", import.meta.url), { type: "module" });

	useWorkerFactory({
		workerOverrides: {
			ignoreMapping: true,
			workerLoaders: {
				TextEditorWorker,
				TextMateWorker,
			},
		},
		logger,
	});

	rbEditor = monaco.editor.create(rbEditorElement, {
		tabSize: 2,
		fontSize: 16,
		automaticLayout: true,
		wordBasedSuggestions: "off",
		suggest: { showWords: false },
		scrollBeyondLastLine: false,
	});

	rbsEditor = monaco.editor.create(rbsEditorElement, {
		tabSize: 2,
		fontSize: 16,
		automaticLayout: true,
		wordBasedSuggestions: "off",
		quickSuggestions: false,
		scrollBeyondLastLine: false,
	});
};

let rbModel: monaco.editor.ITextModel | null = null;
let rbsModel: monaco.editor.ITextModel | null = null;

export const setExample = (rb: string, rbs: string) => {
	rbModel?.dispose();
	rbsModel?.dispose();

	const rbUri = monaco.Uri.from({
		scheme: "inmemory",
		path: "/workspace/test.rb",
	});
	const rbsUri = monaco.Uri.from({
		scheme: "inmemory",
		path: "/workspace/test.rbs",
	});
	rbModel = monaco.editor.createModel(rb, "ruby", rbUri);
	rbsModel = monaco.editor.createModel(rbs, "rbs", rbsUri);
	const f = () => {
		onChange(rbModel?.getValue() || "", rbsModel?.getValue() || "");
	};
	rbModel.onDidChangeContent(f);
	rbModel.onDidChangeContent(f);
	rbEditor.setModel(rbModel);
	rbsEditor.setModel(rbsModel);
};

export const connectWorker = (worker: Worker) => {
	const languageClient = new MonacoLanguageClient({
		name: "TypeProf",
		clientOptions: {
			documentSelector: ["ruby", "rbs"],
			errorHandler: {
				error: () => ({ action: ErrorAction.Shutdown }),
				closed: () => ({ action: CloseAction.Restart }),
			},
		},
		messageTransports: {
			reader: new BrowserMessageReader(worker),
			writer: new BrowserMessageWriter(worker),
		},
	});
	languageClient.start();
};
