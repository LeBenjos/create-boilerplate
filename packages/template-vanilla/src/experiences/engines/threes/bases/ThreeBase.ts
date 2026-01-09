import { DomResizeManager, TickerManager } from '@benjos/cookware';
import { Scene } from 'three';
import ThreeCameraControllerBase from '../../../cameras/threes/bases/ThreeCameraControllerBase';
import WebGLRendererBase from '../../../renderers/threes/bases/WebGLRendererBase';
import ThreeViewBase from '../../../views/threes/bases/ThreeViewBase';

export default abstract class ThreeBase {
    declare protected _domElementContainer: HTMLElement;
    declare protected _scene: Scene;
    declare protected _cameraController: ThreeCameraControllerBase;
    declare protected _renderer: WebGLRendererBase;
    protected readonly _views: ThreeViewBase[];
    declare protected _currentView: ThreeViewBase;

    constructor(domElementContainer: HTMLElement) {
        this._domElementContainer = domElementContainer;
        this._views = [];
    }

    public init(): void {
        TickerManager.add(this._update);

        this._generateScenes();
        this._generateCameras();
        this._generateRenderers();
        this._generateViews();

        this._onResize();
        DomResizeManager.onResize.add(this._onResize);
    }

    protected _generateScenes(): void {
        //
    }

    protected _generateCameras(): void {
        //
    }

    protected _generateRenderers(): void {
        //
    }

    protected _generateViews(): void {
        //
    }

    protected _setCurrentView(view: ThreeViewBase): void {
        if (this._currentView === view) return;
        if (this._currentView) this._removeOldView(this._currentView);
        this._currentView = view;
        this.scene.add(this._currentView);
    }

    private _removeOldView(view: ThreeViewBase): void {
        this.scene.remove(view);
        view.dispose();
    }

    protected _onResize = (): void => {
        this._renderer.domElement.width = window.innerWidth;
        this._renderer.domElement.height = window.innerHeight;

        this._cameraController.resize();
        this._renderer.resize();
    };

    private _update = (dt: number): void => {
        this._cameraController.update(dt);
        this._currentView.update(dt);
        this._renderer.update(dt);
    };

    //#region Getters
    //
    public get domElementContainer(): HTMLElement {
        return this._domElementContainer;
    }
    public get scene(): Scene {
        return this._scene;
    }
    public get renderer(): WebGLRendererBase {
        return this._renderer;
    }
    public get cameraController(): ThreeCameraControllerBase {
        return this._cameraController;
    }
    //
    //#endregion
}
