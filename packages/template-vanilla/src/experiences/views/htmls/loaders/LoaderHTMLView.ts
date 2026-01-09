import { DomUtils } from '@benjos/cookware';
import LoaderManager from '../../../managers/LoaderManager';
import HTMLViewBase from '../bases/HTMLViewBase';

export default class LoaderHTMLView extends HTMLViewBase {
    declare private _loadingBar: HTMLDivElement;
    declare private _loadingProgress: HTMLDivElement;
    declare private _loadingNumber: HTMLSpanElement;

    constructor() {
        super();
        LoaderManager.onBeginLoad.add(this._onBeginLoad);
        LoaderManager.onProgress.add(this._onProgress);
        LoaderManager.onFinishLoad.add(this._onFinishLoad);
    }

    protected override _getElement(): void {
        this._htmlElement = DomUtils.GetLoader().querySelector('#loading-screen')!;
        this._loadingProgress = this._htmlElement.querySelector('.loading-progress')!;
        this._loadingNumber = this._loadingProgress.querySelector('.loading-number')!;
        this._loadingBar = this._htmlElement.querySelector('.loading-bar')!;
    }

    private readonly _onBeginLoad = (): void => {
        this._loadingNumber.textContent = '0';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.remove('ended');
        this.show();
    };

    private _onProgress = (): void => {
        const progress = Math.min(LoaderManager.loadedSize / LoaderManager.totalSize, 1) * 100;
        this._loadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;
        this._loadingNumber.textContent = Math.round(progress).toString();
    };

    private readonly _onFinishLoad = (): void => {
        this._loadingNumber.textContent = '100';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.add('ended');
        this.hide();
    };
}
