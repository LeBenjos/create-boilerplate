import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { domResizeManager, tickerManager } from '../managers';

export default class Camera extends PerspectiveCamera {
    private _controller: OrbitControls;

    constructor(fov: number, aspect: number, near: number, far: number) {
        super(fov, aspect, near, far);
        domResizeManager.onResize.add(this._onResize);
        tickerManager.add(this._update);

        const app = document.getElementById('app');

        this._controller = new OrbitControls(this, app);
        this._controller.enableDamping = true;

        this.position.set(0, 1, -3);
    }

    private _onResize = (): void => {
        this.aspect = domResizeManager.aspectRatio;
        this.updateProjectionMatrix();
    };

    private _update = (): void => {
        this._controller.update();
    };
}
