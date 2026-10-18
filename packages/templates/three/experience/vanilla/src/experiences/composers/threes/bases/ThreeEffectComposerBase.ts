import {
    HalfFloatType,
    WebGLRenderTarget,
    type Camera,
    type Scene,
    type TextureDataType,
    type WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import DomResizeManager from '../../../managers/doms/DomResizeManager';
import ThreePassBase from './passes/ThreePassBase';

export default abstract class ThreeEffectComposerBase extends EffectComposer {
    protected static readonly _DEFAULT_RENDER_TARGET_SAMPLES = 4;
    protected static readonly _DEFAULT_RENDER_TARGET_TYPE = HalfFloatType;

    protected readonly _passes: Pass[];
    declare private _renderPass: RenderPass;

    constructor(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: Camera,
        options: { samples?: number; type?: TextureDataType } = {}
    ) {
        const samples = options.samples ?? ThreeEffectComposerBase._DEFAULT_RENDER_TARGET_SAMPLES;
        const type = options.type ?? ThreeEffectComposerBase._DEFAULT_RENDER_TARGET_TYPE;
        super(renderer, new WebGLRenderTarget(DomResizeManager.width, DomResizeManager.height, { samples, type }));

        this._passes = [];
        this._generateRenderPass(scene, camera);
        this._addPasses();
        this.resize();
    }

    public setCamera(camera: Camera): void {
        this._renderPass.camera = camera;
    }

    public resize(): void {
        this.setSize(DomResizeManager.width, DomResizeManager.height);
        this.setPixelRatio(DomResizeManager.pixelRatio);
    }

    private _generateRenderPass(scene: Scene, camera: Camera): void {
        this._renderPass = new RenderPass(scene, camera);
        this._addPass(this._renderPass);
    }

    protected _addPasses(): void {
        this._addPass(new SMAAPass());
        this._addPass(new OutputPass());
    }

    protected _addPass(pass: Pass): void {
        this.addPass(pass);
        this._passes.push(pass);
    }

    public update(dt: number): void {
        for (const pass of this._passes) {
            if (pass instanceof ThreePassBase) pass.update(dt);
        }
        this.render(dt);
    }
}
