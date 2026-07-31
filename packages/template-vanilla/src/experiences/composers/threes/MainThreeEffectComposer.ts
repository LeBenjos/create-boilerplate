import type { Camera, Scene, WebGLRenderer } from "three";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import ThreeEffectComposerBase from "./bases/ThreeEffectComposerBase";
import TemplateThreePass from "./passes/templates/TemplateThreePass";

export default class MainThreeEffectComposer extends ThreeEffectComposerBase {
    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
        super(renderer, scene, camera);
    }

    protected override _addPasses(): void {
        this._addPass(new TemplateThreePass());
        this._addPass(new GlitchPass());
        super._addPasses();
    }

    public override update(dt: number): void {
        super.update(dt);
    }
}
