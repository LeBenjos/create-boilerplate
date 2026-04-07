import { type Camera, type Scene, type WebGLRenderer } from "three";
import EffectComposerBase from "./bases/EffectComposerBase";
import TemplatePass from "./passes/TemplatePass";
import { GlitchPass } from "three/examples/jsm/Addons.js";

export default class Composer extends EffectComposerBase {
    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        super(renderer, scene, camera);
    }

    protected override _addPasses(): void {
        super._addPasses();
        this._addPass(new TemplatePass());
        this._addPass(new GlitchPass());
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}
