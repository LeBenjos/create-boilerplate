import { WebGLRenderer, type Camera, type Scene, type WebGLRendererParameters } from 'three';
import ThreeEffectComposerBase from '../../../composers/threes/bases/ThreeEffectComposerBase';
import DomResizeManager from '../../../managers/doms/DomResizeManager';

export default abstract class ThreeWebGLRendererBase extends WebGLRenderer {
    protected _composer?: ThreeEffectComposerBase;
    protected _isPostProcessingActive = false;
    protected readonly _scene: Scene;
    protected _camera: Camera;

    constructor(scene: Scene, camera: Camera, parameters: WebGLRendererParameters = {}) {
        super(parameters);

        this._scene = scene;
        this._camera = camera;

        this._generateComposers();
        this.resize();
    }

    protected _generateComposers(): void {
        //
    }

    public setCamera(camera: Camera): void {
        this._camera = camera;
        if (this._composer) {
            this._composer.setCamera(camera);
        }
    }

    public setIsPostProcessingActive(enabled: boolean): void {
        if (enabled && !this._composer) {
            throw new Error(`[${this.constructor.name}]: cannot enable post-processing — no composer`);
        }
        this._isPostProcessingActive = enabled;
    }

    public resize(): void {
        this.setSize(DomResizeManager.width, DomResizeManager.height);
        this.setPixelRatio(DomResizeManager.pixelRatio);
        if (this._composer) this._composer.resize();
    }

    public update(dt: number): void {
        if (this._composer && this._isPostProcessingActive) {
            this._composer.update(dt);
        } else {
            this.render(this._scene, this._camera);
        }
    }

    //#region Getters
    //
    public get composer(): ThreeEffectComposerBase | undefined {
        return this._composer;
    }
    public get isPostProcessingActive(): boolean {
        return this._isPostProcessingActive;
    }
    //
    //#endregion
}
