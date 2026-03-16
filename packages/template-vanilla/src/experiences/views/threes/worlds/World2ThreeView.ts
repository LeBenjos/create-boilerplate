import { DebugGuiTitle } from '../../../constants/experiences/DebugGuiTitle';
import { ViewId } from '../../../constants/experiences/ViewId';
import MainThreeApp from '../../../engines/threes/app/MainThreeApp';
import DebugManager from '../../../managers/DebugManager';
import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import Environment from './components/Environment';
import TemplateFont from './components/actors/TemplateFont';
import TemplateMesh2 from './components/actors/TemplateMesh2';
import TemplateModel from './components/actors/TemplateModel';

export default class World2ThreeView extends ThreeViewBase {
    constructor() {
        super(ViewId.THREE_VIEW_WORLD_2);

        if (LoaderManager.isLoaded) this._onAssetsReady();
        else LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    private readonly _onFinishLoad = (): void => {
        this._onAssetsReady();
        LoaderManager.onFinishLoad.remove(this._onFinishLoad);
    };

    private _onAssetsReady(): void {
        if (DebugManager.isActive) {
            const viewsDebug = DebugManager.getGuiFolder(DebugGuiTitle.THREE_VIEWS)
            viewsDebug.add({ switchToWorld2ThreeView: () => MainThreeApp.setCurrentView(ViewId.THREE_VIEW_WORLD_2) }, 'switchToWorld2ThreeView').name('SWITCH WORLD_2_VIEW');
        }

        this._generateActors();
    }

    protected override _generateActors(): void {
        super._generateActors();
        this._actors.push(new Environment());
        this._actors.push(new TemplateMesh2());
        this._actors.push(new TemplateModel());
        this._actors.push(new TemplateFont());

        for (const actor of this._actors) this.add(actor);
    }

    public override update(dt: number): void {
        for (const actor of this._actors) actor.update(dt);
    }
}
