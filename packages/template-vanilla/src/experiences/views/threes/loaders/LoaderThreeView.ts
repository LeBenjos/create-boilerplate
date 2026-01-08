import { ViewId } from '../../../constants/experiences/ViewId';
import MainThree from '../../../engines/threes/MainThree';
import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import ThreeTemplateLoader from './components/ThreeTemplateLoader';

export default class LoaderThreeView extends ThreeViewBase {
    declare private _threeLoader: ThreeTemplateLoader;

    constructor(id: ViewId) {
        super(id, MainThree.loaderScene);

        this._isVisible = true;
        this._generateLoader();

        LoaderManager.onBeginLoad.add(this._onBeginLoad);
        LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    private _generateLoader(): void {
        this._threeLoader = new ThreeTemplateLoader();

        this._container.add(this._threeLoader);
        this._scene.add(this._container);
    }

    protected override _show(): void {
        this._threeLoader.material.show();
    }

    protected override _hide(): void {
        this._threeLoader.material.hide();
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
    };

    private readonly _onFinishLoad = (): void => {
        this._hide();
    };
}
