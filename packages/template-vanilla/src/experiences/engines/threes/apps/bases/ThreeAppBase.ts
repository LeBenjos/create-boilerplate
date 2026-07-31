import { Action, DomResizeManager, TickerManager } from '@benjos/cookware';
import type { Scene } from 'three';
import type ThreeCameraControllerBase from '../../../../cameras/threes/bases/ThreeCameraControllerBase';
import { CameraId } from '../../../../constants/CameraId';
import type { ViewId } from '../../../../constants/ViewId';
import LoaderManager from '../../../../managers/LoaderManager';
import type ThreeWebGLRendererBase from '../../../../renderers/threes/bases/ThreeWebGLRendererBase';
import type ThreeViewBase from '../../../../views/threes/bases/ThreeViewBase';

export default abstract class ThreeAppBase {
    declare protected _domElementContainer: HTMLElement;
    declare protected _scene: Scene;
    protected readonly _cameraControllers: Map<CameraId, ThreeCameraControllerBase> = new Map();
    declare protected _currentCameraController: ThreeCameraControllerBase;
    declare protected _renderer: ThreeWebGLRendererBase;
    protected readonly _views: ThreeViewBase[];
    protected readonly _viewBuilder: Map<ViewId, new () => ThreeViewBase>;
    protected _currentView: ThreeViewBase | null = null;
    protected _isPaused = false;


    public readonly onCameraControllerChange = new Action();

    constructor() {
        this._views = [];
        this._viewBuilder = new Map();
    }

    public init(): void {
        TickerManager.add(this._update);
        this._cameraControllers.clear();

        this._setDomElementContainer();
        this._generateScenes();
        this._generateCameraControllers();
        this._generateRenderers();
        this._declareViews();

        this._onResize();
        DomResizeManager.onResize.add(this._onResize);
    }

    protected _setDomElementContainer(): void {
        //
    }

    protected _generateScenes(): void {
        //
    }

    protected _generateCameraControllers(): void {
        //
    }

    protected _generateRenderers(): void {
        //
    }

    protected _declareViews(): void {
        //
    }

    protected _generateView(viewId: ViewId): ThreeViewBase {
        const ViewConstructor = this._viewBuilder.get(viewId);
        if (!ViewConstructor) {
            throw new Error(`[${this.constructor.name}]: View constructor for ID '${viewId}' not found in "viewBuilder".`);
        }
        const view = new ViewConstructor();
        this._views.push(view);
        return view;
    }

    protected _setInitialView(viewId: ViewId): void {
        const view = this._generateView(viewId);
        this._currentView = view;
        view.init();
        this._scene.add(view);
    }

    public async setCurrentView(viewId: ViewId): Promise<void> {
        if (this._currentView?.viewId === viewId) return;

        let view = this.getViewById(viewId);
        if (!view) view = this._generateView(viewId);

        view.declareAssets();

        await LoaderManager.loadAssetsWithTransition(this._swapView.bind(this, view));
    }

    private readonly _swapView = (view: ThreeViewBase): void => {
        if (this._currentView) this._removeOldView(this._currentView);
        this._currentView = view;
        view.init();
        this._scene.add(this._currentView);
    }

    public getViewById(viewId: ViewId): ThreeViewBase | null {
        for (const v of this._views) {
            if (v.viewId === viewId) return v;
        }
        return null;
    }

    public play(): void {
        if (!this._isPaused) return;
        this._isPaused = false;
        TickerManager.add(this._update);
    }

    public pause(): void {
        if (this._isPaused) return;
        this._isPaused = true;
        TickerManager.remove(this._update);
    }

    public setCurrentCameraController(cameraId: CameraId): void {
        const threeCameraController = this._cameraControllers.get(cameraId)!;
        if (!threeCameraController) throw new Error(`[${this.constructor.name}]: No cameraController with id '${cameraId}'`);
        this._currentCameraController.disable();
        this._currentCameraController = threeCameraController;
        this._currentCameraController.enable();
        this._renderer.setCamera(this._currentCameraController.camera);
        this._onResize();
        this.onCameraControllerChange.execute();
    }

    private _removeOldView(view: ThreeViewBase): void {
        this.scene.remove(view);
        view.dispose();
        view.reset();
    }

    protected _onResize = (): void => {
        this._renderer.domElement.width = window.innerWidth;
        this._renderer.domElement.height = window.innerHeight;

        this._currentCameraController.resize();
        this._renderer.resize();
    };

    private _update = (dt: number): void => {
        this._currentCameraController.update(dt);
        this._currentView?.update(dt);
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
    public get renderer(): ThreeWebGLRendererBase {
        return this._renderer;
    }
    public get currentCameraController(): ThreeCameraControllerBase {
        return this._currentCameraController;
    }
    public get currentView(): ThreeViewBase | null {
        return this._currentView;
    }
    public get isPaused(): boolean {
        return this._isPaused;
    }
    //
    //#endregion
}
