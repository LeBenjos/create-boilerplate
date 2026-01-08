import type { ViewId } from '../constants/experiences/ViewId';
import { ViewType } from '../constants/experiences/ViewType';
import type ViewBase from '../views/bases/ViewBase';

type ViewConstructor<T extends ViewBase> = new (id: ViewId) => T;

class ViewProxy {
    private _views = new Map<ViewId, ViewBase>();

    public init(): void {
        //
    }

    public add(viewId: ViewId, ViewClass: ViewConstructor<ViewBase>): void {
        if (this._views.has(viewId)) {
            throw new Error(`ViewProxy: View with id "${viewId}" already exists.`);
        }

        this._views.set(viewId, new ViewClass(viewId));
    }

    public getById<T extends ViewBase = ViewBase>(viewId: ViewId): T {
        const view = this._views.get(viewId);
        if (!view) throw new Error(`ViewProxy: View with id "${viewId}" not found.`);
        return view as T;
    }

    public has(viewId: ViewId): boolean {
        return this._views.has(viewId);
    }

    public getAll<T extends ViewBase>(type?: ViewType): T[] {
        const views: T[] = [];

        this._views.forEach((view) => {
            if (type && type === view.type) {
                views.push(view as T);
            } else {
                views.push(view as T);
            }
        });

        return views;
    }
}

export default new ViewProxy();
