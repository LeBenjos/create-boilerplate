import { Object3D } from 'three';
import type { ViewId } from '../../../constants/ViewId';
import type ThreeActorBase from './components/ThreeActorBase';

export default abstract class ThreeViewBase extends Object3D {
    private readonly _viewId: ViewId;
    protected readonly _actors: ThreeActorBase[];
    private _areActorsGenerated = false;

    constructor(viewId: ViewId) {
        super();
        this._viewId = viewId;
        this._actors = [];
    }

    public declareAssets(): void {
        //
    }

    public init(): void {
        if (!this._areActorsGenerated) this._generateActors();
        this.reset();
        for (const actor of this._actors) actor.init();
    }

    public reset(): void {
        for (const actor of this._actors) actor.reset();
    }

    protected _generateActors(): void {
        this._areActorsGenerated = true;
    }

    public dispose(): void {
        for (const actor of this._actors) {
            actor.dispose();
        }
    }

    public update(_dt: number): void {
        //
    }

    //#region Getters
    //
    public get viewId(): ViewId { return this._viewId; }
    //
    //#endregion
}
