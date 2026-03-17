import { DomUtils } from '@benjos/cookware';
import LoaderManager from '../../../managers/LoaderManager';
import HTMLViewBase from '../bases/HTMLViewBase';

export default class LoaderHTMLView extends HTMLViewBase {
    declare private _loadingBar: HTMLDivElement;
    declare private _loadingProgress: HTMLDivElement;
    declare private _loadingNumber: HTMLSpanElement;

    constructor() {
        super();
        LoaderManager.onProgress.add(this._onProgress);
        LoaderManager.onShow.add(this._onShow);
        LoaderManager.onHide.add(this._onHide);
    }

    protected override _getElement(): void {
        this._htmlElement = DomUtils.GetLoader().querySelector('#loading-screen')!;
        this._loadingProgress = this._htmlElement.querySelector('.loading-progress')!;
        this._loadingNumber = this._loadingProgress.querySelector('.loading-number')!;
        this._loadingBar = this._htmlElement.querySelector('.loading-bar')!;
    }

    private readonly _onShow = (): void => {
        this._loadingNumber.textContent = '0';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.remove('ended');
        this.show();
    };
    private readonly _onProgress = (): void => {
        const progress = LoaderManager.progress * 100;
        this._loadingBar.style.transform = `translateY(-50%) scaleX(${LoaderManager.progress})`;
        this._loadingNumber.textContent = Math.round(progress).toString();
    };

    private readonly _onHide = (): void => {
        this._loadingNumber.textContent = '100';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.add('ended');
        this.hide();
    };
}
