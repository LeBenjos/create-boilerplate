import { DomKeyboardManager, DomResizeManager, DomUtils, TickerManager } from '@benjos/cookware';
import { KeyboardConstant } from '@benjos/spices';
import { MeshStandardMaterial, Scene } from 'three';
import type ThreeCameraControllerBase from '../../cameras/threes/bases/ThreeCameraControllerBase';
import DebugThreeCameraController from '../../cameras/threes/DebugThreeCameraController';
import LoaderThreeCameraController from '../../cameras/threes/LoaderThreeCameraController';
import MainThreeCameraController from '../../cameras/threes/MainThreeCameraController';
import { CameraId } from '../../constants/experiences/CameraId';
import { ViewId } from '../../constants/experiences/ViewId';
import DebugManager from '../../managers/DebugManager';
import ThreeCameraControllerManager from '../../managers/threes/ThreeCameraControllerManager';
import ViewProxy from '../../proxies/ViewProxy';
import WebGLRendererBase from '../../renderers/threes/bases/WebGLRendererBase';
import LoaderRenderer from '../../renderers/threes/LoaderRenderer';
import Renderer from '../../renderers/threes/Renderer';
import LoaderThreeView from '../../views/threes/loaders/LoaderThreeView';
import WorldThreeView from '../../views/threes/worlds/WorldThreeView';

class MainThree {
    private static readonly _DEBUG_WIREFRAME_MATERIAL_COLOR: number = 0x3f79f3;
    private static readonly _TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS: string[] = [
        KeyboardConstant.CODES.SHIFT_LEFT,
        KeyboardConstant.CODES.KEY_C,
    ];
    private static readonly _TOGGLE_WIREFRAME_KEYS: string[] = [
        KeyboardConstant.CODES.SHIFT_LEFT,
        KeyboardConstant.CODES.KEY_W,
    ];

    declare private _domElementContainer: HTMLElement;
    declare private _loaderDomElementContainer: HTMLElement;
    declare private _scene: Scene;
    declare private _loaderScene: Scene;
    declare private _cameraController: ThreeCameraControllerBase;
    declare private _renderer: Renderer;
    declare private _loaderRenderer: WebGLRendererBase;
    declare private _debugWireframeMaterial: MeshStandardMaterial;

    public init(): void {
        TickerManager.add(this._update);

        this._domElementContainer = DomUtils.GetApp();
        this._loaderDomElementContainer = DomUtils.GetLoader();

        this._generateScenes();
        this._generateCameras();
        this._generateRenderers();

        this._onResize();
        DomResizeManager.onResize.add(this._onResize);

        this._generateViews();

        if (DebugManager.isActive) {
            window.mainThree = this;
            DomKeyboardManager.onKeyUp.add(this._onKeyUp);
        }
    }

    private _generateScenes(): void {
        this._scene = new Scene();
        this._loaderScene = new Scene();

        if (DebugManager.isActive) {
            this._debugWireframeMaterial = new MeshStandardMaterial({
                wireframe: true,
                color: MainThree._DEBUG_WIREFRAME_MATERIAL_COLOR,
            });
        }
    }

    private _generateViews(): void {
        ViewProxy.add(ViewId.THREE_LOADER, LoaderThreeView);
        ViewProxy.add(ViewId.THREE_WORLD, WorldThreeView);
    }

    private _generateCameras(): void {
        ThreeCameraControllerManager.add(new MainThreeCameraController(), true);
        ThreeCameraControllerManager.add(new LoaderThreeCameraController());
        this._cameraController = ThreeCameraControllerManager.get(CameraId.THREE_MAIN);

        if (DebugManager.isActive) {
            ThreeCameraControllerManager.add(new DebugThreeCameraController());
        }

        ThreeCameraControllerManager.onActiveThreeCameraControllerChange.add(this._onActiveCameraControllerChange);
    }

    private _generateRenderers(): void {
        this._renderer = new Renderer(this._scene, this._cameraController.camera, { antialias: true });
        this._domElementContainer.appendChild(this._renderer.domElement);

        this._loaderRenderer = new LoaderRenderer(
            this._loaderScene,
            ThreeCameraControllerManager.get(CameraId.THREE_LOADER).camera
        );
        this._loaderDomElementContainer.appendChild(this._loaderRenderer.domElement);
    }

    private _onActiveCameraControllerChange = (): void => {
        this._cameraController = ThreeCameraControllerManager.activeThreeCameraController;
        this._renderer.setCamera(this._cameraController.camera);
        this._onResize();
    };

    private readonly _onKeyUp = (_e: KeyboardEvent): void => {
        if (DebugManager.isActive) {
            if (DomKeyboardManager.areAllKeysDown(MainThree._TOGGLE_SWITCH_TO_DEBUG_CAMERA_KEYS)) {
                ThreeCameraControllerManager.setActiveCamera(
                    this._cameraController.cameraId === CameraId.THREE_MAIN
                        ? CameraId.THREE_DEBUG
                        : CameraId.THREE_MAIN
                );
            } else if (DomKeyboardManager.areAllKeysDown(MainThree._TOGGLE_WIREFRAME_KEYS)) {
                if (this._scene.overrideMaterial === null) {
                    this._scene.overrideMaterial = this._debugWireframeMaterial;
                    this._loaderScene.overrideMaterial = this._debugWireframeMaterial;
                } else {
                    this._scene.overrideMaterial = null;
                    this._loaderScene.overrideMaterial = null;
                }
            }
        }
    };

    private _onResize = (): void => {
        this._renderer.domElement.width = window.innerWidth;
        this._renderer.domElement.height = window.innerHeight;

        this._loaderRenderer.domElement.width = window.innerWidth;
        this._loaderRenderer.domElement.height = window.innerHeight;

        this._cameraController.resize();
        this._renderer.resize();
        this._loaderRenderer.resize();
    };

    private _update = (dt: number): void => {
        this._cameraController.update(dt);
        if (ViewProxy.has(ViewId.THREE_WORLD)) ViewProxy.getById<WorldThreeView>(ViewId.THREE_WORLD).update(dt);
        this._renderer.update(dt);
        this._loaderRenderer.update(dt);
    };

    //#region Getters
    //
    public get domElementContainer(): HTMLElement {
        return this._domElementContainer;
    }
    public get scene(): Scene {
        return this._scene;
    }
    public get loaderScene(): Scene {
        return this._loaderScene;
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

export type { MainThree };
export default new MainThree();
