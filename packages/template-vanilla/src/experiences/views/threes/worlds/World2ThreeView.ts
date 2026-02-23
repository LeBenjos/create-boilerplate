import { ViewId } from '../../../constants/experiences/ViewId';
import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import Environment from './components/Environment';
import TemplateFont from './components/actors/TemplateFont';
import TemplateMesh2 from './components/actors/TemplateMesh2';
import TemplateModel from './components/actors/TemplateModel';

export default class World2ThreeView extends ThreeViewBase {
    declare private _environment: Environment;

    constructor() {
        super(ViewId.THREE_VIEW_WORLD_2);
        LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    private readonly _onFinishLoad = (): void => {
        this._generateEnvironment();
        this._generateActors();
        LoaderManager.onFinishLoad.remove(this._onFinishLoad);
    };

    private _generateEnvironment(): void {
        this._environment = new Environment();

        this.add(this._environment);
    }

    protected override _generateActors(): void {
        super._generateActors();
        this._actors.push(new TemplateMesh2());
        this._actors.push(new TemplateModel());
        this._actors.push(new TemplateFont());

        for (const actor of this._actors) this.add(actor);
    }

    public override update(dt: number): void {
        if (!this._environment) return;

        this._environment.update(dt);
        for (const actor of this._actors) actor.update(dt);
    }
}
