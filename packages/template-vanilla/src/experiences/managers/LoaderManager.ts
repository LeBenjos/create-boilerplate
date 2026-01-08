import { Action } from '@benjos/cookware';
import ThreeAssetsManager from './threes/ThreeAssetsManager';

class LoaderManager {
    private _totalSize = 0;
    private _loadedSize = 0;

    public readonly onBeginLoad = new Action();
    public readonly onProgress = new Action();
    public readonly onFinishLoad = new Action();

    public init(): void {
        this._addCallbacks();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        ThreeAssetsManager.onLoad.add(this._onLoad);
        ThreeAssetsManager.onProgress.add(this._onProgress);
    }

    private _removeCallbacks(): void {
        ThreeAssetsManager.onLoad.remove(this._onLoad);
        ThreeAssetsManager.onProgress.remove(this._onProgress);
    }

    private _beginLoad = (): void => {
        ThreeAssetsManager.beginLoad();
        this.onBeginLoad.execute();
    }

    private _finishLoad = (): void => {
        ThreeAssetsManager.finishLoad();
        this.onFinishLoad.execute();
    };

    public loadAllAssets(): void {
        if (this._checkIsFinished()) return;
        this._beginLoad();
    }

    private _onLoad = (): void => {
        this._refreshSizes();
        if (this._checkIsFinished()) this._finishLoad();
    };

    private _checkIsFinished = (): boolean => {
        if (!ThreeAssetsManager.isLoaded) return false;
        return true;
    };

    private _onProgress = (): void => {
        this._refreshSizes();
        this.onProgress.execute();
    };

    private _refreshSizes = (): void => {
        this._refreshTotalSize();
        this._refreshLoadedSize();
    };

    private _refreshTotalSize = (): void => {
        this._totalSize = 0;
        this._totalSize += ThreeAssetsManager.totalSize;
    };

    private _refreshLoadedSize = (): void => {
        this._loadedSize = 0;
        this._loadedSize += ThreeAssetsManager.loadedSize;
    };

    //#region Getters
    //
    public get isLoaded(): boolean {
        return this._checkIsFinished();
    }
    public get totalSize(): number {
        return this._totalSize;
    }
    public get loadedSize(): number {
        return this._loadedSize;
    }
    //
    //#endregion
}

export default new LoaderManager();
