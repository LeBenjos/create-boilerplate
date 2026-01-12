import { DomUtils } from '@benjos/cookware';
import { Scene } from 'three';
import LoaderThreeCameraController from '../../../cameras/threes/LoaderThreeCameraController';
import { CameraId } from '../../../constants/experiences/CameraId';
import ThreeCameraControllerManager from '../../../managers/threes/ThreeCameraControllerManager';
import LoaderRenderer from '../../../renderers/threes/LoaderRenderer';
import LoaderThreeView from '../../../views/threes/loaders/LoaderThreeView';
import ThreeAppBase from './bases/ThreeAppBase';

class LoaderThreeApp extends ThreeAppBase {
    constructor() {
        super(DomUtils.GetLoader());
    }

    protected override _generateScenes(): void {
        this._scene = new Scene();
    }

    protected override _generateCameras(): void {
        ThreeCameraControllerManager.add(new LoaderThreeCameraController());
        this._cameraController = ThreeCameraControllerManager.get(CameraId.THREE_LOADER);
    }

    protected override _generateRenderers(): void {
        this._renderer = new LoaderRenderer(
            this._scene,
            ThreeCameraControllerManager.get(CameraId.THREE_LOADER).camera
        );
        this._domElementContainer.appendChild(this._renderer.domElement);
    }

    protected override _generateViews(): void {
        const loaderThreeView = new LoaderThreeView();
        this._views.push(loaderThreeView);
        this._setCurrentView(loaderThreeView);
    }
}

export default new LoaderThreeApp();
