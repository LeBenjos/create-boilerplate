import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import TemplateLoaderThreeActor from './components/TemplateLoaderThreeActor';

export default class LoaderThreeView extends ThreeViewBase {
    declare private _threeLoader: TemplateLoaderThreeActor;

    constructor() {
        super();
        this._generateActors();
        LoaderManager.onBeginLoad.add(this._onBeginLoad);
        LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    protected override _generateActors(): void {
        super._generateActors();
        this._threeLoader = new TemplateLoaderThreeActor();
        this._actors.push(this._threeLoader);

        for (const actor of this._actors) this.add(actor);
    }

    protected _show(): void {
        this._threeLoader.material.show();
    }

    protected _hide(): void {
        this._threeLoader.material.hide();
    }

    private readonly _onBeginLoad = (): void => {
        this._show();
    };

    private readonly _onFinishLoad = (): void => {
        this._hide();
    };
}
