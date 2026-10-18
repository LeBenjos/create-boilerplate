import { DebugGuiTitle } from '../../../constants/DebugGuiTitle';
import { ViewId } from '../../../constants/ViewId';
import MainThreeApp from '../../../engines/threes/apps/MainThreeApp';
import DebugManager from '../../../managers/DebugManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import EnvironmentThreeActor from './components/EnvironmentThreeActor';
import TemplateFontThreeActor from './components/TemplateFontThreeActor';
import TemplateMeshThreeActor from './components/TemplateMeshThreeActor';
import TemplateThreeModel from './components/TemplateThreeModel';

export default class World1ThreeView extends ThreeViewBase {
    constructor() {
        super(ViewId.THREE_WORLD_1);
    }

    protected override _generateActors(): void {
        super._generateActors();

        if (DebugManager.isActive) this._setupDebug();

        this._actors.push(new EnvironmentThreeActor());
        this._actors.push(new TemplateMeshThreeActor());
        this._actors.push(new TemplateThreeModel());
        this._actors.push(new TemplateFontThreeActor());

        for (const actor of this._actors) this.add(actor);
    }

    private _setupDebug(): void {
        const viewsDebug = DebugManager.getGuiFolder(DebugGuiTitle.THREE_VIEWS);
        viewsDebug
            .add(
                { switchToWorld1ThreeView: () => MainThreeApp.setCurrentView(ViewId.THREE_WORLD_1) },
                'switchToWorld1ThreeView'
            )
            .name('SWITCH WORLD_1_VIEW');
    }
}
