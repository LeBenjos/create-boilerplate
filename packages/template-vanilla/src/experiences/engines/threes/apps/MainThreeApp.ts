import { DomKeyboardManager, DomUtils } from '@benjos/cookware';
import { KeyboardConstant } from '@benjos/spices';
import { MeshStandardMaterial, Scene } from 'three';
import DebugThreeCameraController from '../../../cameras/threes/DebugThreeCameraController';
import MainThreeCameraController from '../../../cameras/threes/MainThreeCameraController';
import { CameraId } from '../../../constants/CameraId';
import { DebugGuiTitle } from '../../../constants/DebugGuiTitle';
import { ViewId } from '../../../constants/ViewId';
import DebugManager from '../../../managers/DebugManager';
import MainThreeWebGLRenderer from '../../../renderers/threes/MainThreeWebGLRenderer';
import World1ThreeView from '../../../views/threes/worlds/World1ThreeView';
import World2ThreeView from '../../../views/threes/worlds/World2ThreeView';
import ThreeAppBase from './bases/ThreeAppBase';

class MainThreeApp extends ThreeAppBase {
    private static readonly _DEBUG_WIREFRAME_MATERIAL_COLOR: number = 0x3f79f3;
    private static readonly _TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS: string[] = [
        KeyboardConstant.CODES.SHIFT_LEFT,
        KeyboardConstant.CODES.KEY_C,
    ];
    private static readonly _TOGGLE_WIREFRAME_KEYS: string[] = [
        KeyboardConstant.CODES.SHIFT_LEFT,
        KeyboardConstant.CODES.KEY_W,
    ];

    declare private _debugWireframeMaterial: MeshStandardMaterial;
    declare private _debugPreviousCameraId: CameraId;

    constructor() {
        super();
    }

    public override init(): void {
        super.init();

        if (DebugManager.isActive) this._setupDebug();
    }

    protected override _setDomElementContainer(): void {
        this._domElementContainer = DomUtils.GetApp();
    }

    protected override _generateScenes(): void {
        this._scene = new Scene();
    }

    protected override _generateCameraControllers(): void {
        const mainCameraController = new MainThreeCameraController();
        this._cameraControllers.set(mainCameraController.cameraId, mainCameraController);
        this._currentCameraController = mainCameraController;
        mainCameraController.enable();
    }

    protected override _generateRenderers(): void {
        this._renderer = new MainThreeWebGLRenderer(this._scene, this._currentCameraController.camera, { antialias: true });
        this._domElementContainer.appendChild(this._renderer.domElement);
    }

    protected override _declareViews(): void {
        this._viewBuilder.set(ViewId.THREE_WORLD_1, World1ThreeView);
        this._viewBuilder.set(ViewId.THREE_WORLD_2, World2ThreeView);
    }

    private _setupDebug(): void {
        window.mainThreeApp = this;
        DomKeyboardManager.onKeyDown.add(this._onKeyDown);

        this._debugWireframeMaterial = new MeshStandardMaterial({
            wireframe: true,
            color: MainThreeApp._DEBUG_WIREFRAME_MATERIAL_COLOR,
        });

        const debugCameraController = new DebugThreeCameraController();
        this._cameraControllers.set(debugCameraController.cameraId, debugCameraController);

        const viewsDebug = DebugManager.getGuiFolder(DebugGuiTitle.THREE_VIEWS);
        viewsDebug.add({ resetCurrentView: () => this._currentView?.reset() }, 'resetCurrentView');
        viewsDebug.add({ createWorld1: () => this.setCurrentView(ViewId.THREE_WORLD_1) }, 'createWorld1');
        viewsDebug.add({ createWorld2: () => this.setCurrentView(ViewId.THREE_WORLD_2) }, 'createWorld2');
    }

    private readonly _onKeyDown = (_e: KeyboardEvent): void => {
        if (DomKeyboardManager.areAllKeysDown(MainThreeApp._TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS)) {
            this._toggleCameraController();
        } else if (DomKeyboardManager.areAllKeysDown(MainThreeApp._TOGGLE_WIREFRAME_KEYS)) {
            this._toggleWireframe();
        }
    }

    private _toggleCameraController(): void {
        if (this._currentCameraController.cameraId !== CameraId.THREE_DEBUG) this._debugPreviousCameraId = this._currentCameraController.cameraId;
        this.setCurrentCameraController(
            this._currentCameraController.cameraId === CameraId.THREE_DEBUG ? this._debugPreviousCameraId : CameraId.THREE_DEBUG
        );
    }

    private _toggleWireframe(): void {
        if (this._scene.overrideMaterial === null) {
            this._scene.overrideMaterial = this._debugWireframeMaterial;
        } else {
            this._scene.overrideMaterial = null;
        }
    }
}

export type { MainThreeApp };
export default new MainThreeApp();
