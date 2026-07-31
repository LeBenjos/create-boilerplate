import { DomPointerManager } from '@benjos/cookware';
import { Raycaster, Vector2, type Camera, type Intersection, type Object3D } from 'three';

class ThreeRaycasterManager {
    private readonly _raycaster = new Raycaster();
    private readonly _pointerPosition = new Vector2();

    public init(): void {
        //
    }

    public castFromCameraToPointer(camera: Camera, objects: Object3D[], recursive = true): Intersection[] {
        this._pointerPosition.set(DomPointerManager.ndcX, DomPointerManager.ndcY);
        this._raycaster.setFromCamera(this._pointerPosition, camera);
        const intersects = this._raycaster.intersectObjects(objects, recursive);
        return intersects;
    }
}

export default new ThreeRaycasterManager();
