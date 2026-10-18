import { Object3D, OrthographicCamera, PerspectiveCamera, type Scene } from 'three';
import type { CameraId } from '../../../constants/CameraId';
import DomResizeManager from '../../../managers/doms/DomResizeManager';
import { ThreeCameraType, type ThreeCameraOptions, type ThreeControls } from '../../../types/cameraTypes';

export default abstract class ThreeCameraControllerBase<T extends ThreeControls = ThreeControls> extends Object3D {
    protected readonly _cameraId: CameraId;
    declare protected _container: Object3D;
    declare protected _camera: PerspectiveCamera | OrthographicCamera;
    protected _controls?: T;

    constructor(cameraId: CameraId, cameraOptions: ThreeCameraOptions, scene: Scene) {
        super();
        this._cameraId = cameraId;

        this._generateContainer();
        this._generateCamera(cameraOptions);

        scene.add(this);
    }

    private _generateContainer(): void {
        this._container = new Object3D();
        this.add(this._container);
    }

    private _generateCamera(cameraOptions: ThreeCameraOptions): void {
        if (cameraOptions.type === ThreeCameraType.PERSPECTIVE) {
            this._camera = new PerspectiveCamera(
                cameraOptions.fov,
                cameraOptions.aspect,
                cameraOptions.near,
                cameraOptions.far
            );
        } else if (cameraOptions.type === ThreeCameraType.ORTHOGRAPHIC) {
            this._camera = new OrthographicCamera(
                cameraOptions.left,
                cameraOptions.right,
                cameraOptions.top,
                cameraOptions.bottom,
                cameraOptions.near,
                cameraOptions.far
            );
        }
        this._container.add(this._camera);
    }

    public enable(): void {
        if (this._controls) this._controls.enabled = true;
    }

    public disable(): void {
        if (this._controls) this._controls.enabled = false;
    }

    public resize(): void {
        if (this._camera instanceof PerspectiveCamera) {
            this._camera.aspect = DomResizeManager.width / DomResizeManager.height;
        } else if (this._camera instanceof OrthographicCamera) {
            const aspect = DomResizeManager.width / DomResizeManager.height;
            const verticalSize = this._camera.top - this._camera.bottom;
            const horizontalCenter = (this._camera.left + this._camera.right) / 2;
            const halfWidth = (verticalSize * aspect) / 2;
            this._camera.left = horizontalCenter - halfWidth;
            this._camera.right = horizontalCenter + halfWidth;
        }
        this._camera.updateProjectionMatrix();
    }

    public update(_dt: number): void {
        if (this._controls) this._controls.update();
    }

    //#region Getters
    //
    public get cameraId(): CameraId {
        return this._cameraId;
    }
    public get container(): Object3D {
        return this._container;
    }
    public get camera(): PerspectiveCamera | OrthographicCamera {
        return this._camera;
    }
    //
    //#endregion
}
