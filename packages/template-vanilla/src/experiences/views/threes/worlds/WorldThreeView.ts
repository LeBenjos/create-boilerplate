import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import Environment from './components/Environment';
import TemplateFont from './components/actors/TemplateFont';
import TemplateMesh from './components/actors/TemplateMesh';
import TemplateModel from './components/actors/TemplateModel';

export default class WorldThreeView extends ThreeViewBase {
    declare private _environment: Environment;

    constructor() {
        super();
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
        this._actors.push(new TemplateMesh());
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
