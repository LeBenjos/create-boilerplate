import { DomUtils } from '@benjos/cookware';
import { Scene } from 'three';
import LoaderThreeCameraController from '../../../cameras/threes/LoaderThreeCameraController';
import { CameraId } from '../../../constants/CameraId';
import LoaderManager from '../../../managers/LoaderManager';
import LoaderThreeWebGLRenderer from '../../../renderers/threes/LoaderThreeWebGLRenderer';
import LoaderThreeView from '../../../views/threes/loaders/LoaderThreeView';
import ThreeAppBase from './bases/ThreeAppBase';
import { ViewId } from '../../../constants/ViewId';

class LoaderThreeApp extends ThreeAppBase {
    constructor() {
        super();
    }

    public override init(): void {
        super.init();
        this._addCallbacks();
    }

    private _addCallbacks(): void {
        LoaderManager.onShow.add(this._onLoaderShow);
        LoaderManager.onHideComplete.add(this._onLoaderHideComplete);
        const loaderThreeView = this._currentView as LoaderThreeView;
        LoaderManager.setShowTransition(loaderThreeView.show);
        LoaderManager.setHideTransition(loaderThreeView.hide);
    }

    protected override _setDomElementContainer(): void {
        this._domElementContainer = DomUtils.GetLoader();
    }

    protected override _generateScenes(): void {
        this._scene = new Scene();
    }

    protected override _generateCameraControllers(): void {
        const loaderCameraController = new LoaderThreeCameraController();
        this._cameraControllers.set(loaderCameraController.cameraId, loaderCameraController);
        this._currentCameraController = this._cameraControllers.get(CameraId.THREE_LOADER)!;
        loaderCameraController.enable();
    }

    protected override _generateRenderers(): void {
        this._renderer = new LoaderThreeWebGLRenderer(this._scene, this._currentCameraController.camera);
        this._domElementContainer.appendChild(this._renderer.domElement);
    }

    protected override _declareViews(): void {
        this._viewBuilder.set(ViewId.THREE_LOADER, LoaderThreeView);
        this._setInitialView(ViewId.THREE_LOADER);
    }

    private readonly _onLoaderShow = (): void => {
        this.play();
    };

    private readonly _onLoaderHideComplete = (): void => {
        this.pause();
    };
}

export default new LoaderThreeApp();
