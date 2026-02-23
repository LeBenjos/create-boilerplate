import { Object3D } from 'three';
import { ViewId } from '../../../constants/experiences/ViewId';
import ThreeActorBase from '../worlds/components/actors/bases/ThreeActorBase';

export default abstract class ThreeViewBase extends Object3D {
    private readonly _id: ViewId;
    protected readonly _actors: ThreeActorBase[];

    constructor(id: ViewId) {
        super();
        this._id = id;
        this._actors = [];
    }

    public init(): void {
        this.reset();
        for (const actor of this._actors) actor.init();
    }

    public reset(): void {
        for (const actor of this._actors) actor.reset();
    }

    protected _generateActors(): void {
        //
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
    public get viewId(): ViewId { return this._id; }
    //
    //#endregion
}
