import { Object3D, Scene } from 'three';
import type { ViewId } from '../../../constants/experiences/ViewId';
import { ViewType } from '../../../constants/experiences/ViewType';
import MainThree from '../../../engines/threes/MainThree';
import ViewBase from '../../bases/ViewBase';

export default abstract class ThreeViewBase extends ViewBase {
    protected _scene: Scene;
    protected _container: Object3D;

    constructor(id: ViewId, scene: Scene = MainThree.scene) {
        super(id, ViewType.THREE);

        this._scene = scene;
        this._container = new Object3D();
    }

    protected override _show(): void {
        super._show();
        this._scene.add(this._container);
    }

    protected override _hide(): void {
        super._hide();
        this._scene.remove(this._container);
    }
}
