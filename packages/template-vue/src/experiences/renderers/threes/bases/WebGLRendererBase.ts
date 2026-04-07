import { DomResizeManager } from '@benjos/cookware';
import { Camera, Scene, WebGLRenderer, type WebGLRendererParameters } from 'three';
import EffectComposerBase from '../../../composers/threes/bases/EffectComposerBase';

export default abstract class WebGLRendererBase extends WebGLRenderer {
    protected _composer?: EffectComposerBase;
    protected _isPostProcessingActive: boolean = false;
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
        this._isPostProcessingActive = enabled && !!this._composer;
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
    public get composer(): EffectComposerBase {
        return this._composer!;
    }
    public get isPostProcessingActive(): boolean {
        return this._isPostProcessingActive;
    }
    //
    //#endregion
}
