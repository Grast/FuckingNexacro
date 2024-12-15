import FuckingNexacro from "./FuckingNexacro.svelte";

Object.defineProperty(window, "eval", {
	value: () => { throw new Error("eval is blocked."); },
	writable: false,
	configurable: false
});

window["FuckingNexacro"] = FuckingNexacro;