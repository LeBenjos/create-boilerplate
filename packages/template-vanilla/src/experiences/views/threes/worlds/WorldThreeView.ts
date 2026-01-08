import { ViewId } from '../../../constants/experiences/ViewId';
import LoaderManager from '../../../managers/LoaderManager';
import ThreeViewBase from '../bases/ThreeViewBase';
import Environment from './components/Environment';
import TemplateFont from './components/actors/TemplateFont';
import TemplateMesh from './components/actors/TemplateMesh';
import TemplateModel from './components/actors/TemplateModel';
import type ActorBase from './components/actors/bases/ActorBase';

export default class WorldThreeView extends ThreeViewBase {
    declare private _environment: Environment;
    private readonly _actors: ActorBase[];

    constructor(id: ViewId) {
        super(id);

        this._actors = [];

        LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    private readonly _onFinishLoad = (): void => {
        this._generateEnvironment();
        this._generateActors();

        this._show();
    };

    private _generateEnvironment(): void {
        if (this._environment) return;
        this._environment = new Environment();

        this._container.add(this._environment);
    }

    private _generateActors(): void {
        if (this._actors.length > 0) return;
        this._actors.push(new TemplateMesh());
        this._actors.push(new TemplateModel());
        this._actors.push(new TemplateFont());

        for (const actor of this._actors) this._container.add(actor);
    }

    public update(dt: number): void {
        if (!this._environment) return;

        this._environment.update(dt);
        for (const actor of this._actors) actor.update(dt);
    }
}
