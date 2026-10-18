import { PerspectiveCamera, Scene, WebGLRenderer, type WebGLRendererParameters } from 'three';
import { domResizeManager, tickerManager } from '../managers';

export default class Renderer extends WebGLRenderer {
    private _scene: Scene;
    private _camera: PerspectiveCamera;

    constructor(scene: Scene, camera: PerspectiveCamera, params?: WebGLRendererParameters) {
        super(params);
        this._scene = scene;
        this._camera = camera;
        const app = document.getElementById('app');
        app!.appendChild(this.domElement);
        domResizeManager.onResize.add(this._onResize);
        tickerManager.add(this._update);
    }

    private _onResize = (): void => {
        this.setPixelRatio(domResizeManager.pixelRatio);
        this.setSize(domResizeManager.width, domResizeManager.height);
    };

    private _update = (): void => {
        this.render(this._scene, this._camera);
    };
}
