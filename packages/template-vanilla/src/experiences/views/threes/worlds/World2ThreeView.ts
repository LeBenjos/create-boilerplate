import { DebugGuiTitle } from '../../../constants/DebugGuiTitle';
import { ViewId } from '../../../constants/ViewId';
import MainThreeApp from '../../../engines/threes/apps/MainThreeApp';
import DebugManager from '../../../managers/DebugManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import EnvironmentThreeActor from './components/EnvironmentThreeActor';
import TemplateFontThreeActor from './components/TemplateFontThreeActor';
import TemplateMesh2ThreeActor from './components/TemplateMesh2ThreeActor';
import TemplateThreeModel from './components/TemplateThreeModel';

export default class World2ThreeView extends ThreeViewBase {
    constructor() {
        super(ViewId.THREE_WORLD_2);
    }

    protected override _generateActors(): void {
        super._generateActors();

        if (DebugManager.isActive) this._setupDebug();

        this._actors.push(new EnvironmentThreeActor());
        this._actors.push(new TemplateMesh2ThreeActor());
        this._actors.push(new TemplateThreeModel());
        this._actors.push(new TemplateFontThreeActor());

        for (const actor of this._actors) this.add(actor);
    }

    private _setupDebug(): void {
        const viewsDebug = DebugManager.getGuiFolder(DebugGuiTitle.THREE_VIEWS)
        viewsDebug.add({ switchToWorld2ThreeView: () => MainThreeApp.setCurrentView(ViewId.THREE_WORLD_2) }, 'switchToWorld2ThreeView').name('SWITCH WORLD_2_VIEW');
    }
}
