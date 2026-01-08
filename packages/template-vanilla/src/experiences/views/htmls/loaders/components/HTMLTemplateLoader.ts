import LoaderManager from '../../../../managers/LoaderManager';

export default class HTMLTemplateLoader {
    declare private _htmlElement: HTMLDivElement;
    declare private _loadingBar: HTMLDivElement;
    declare private _loadingProgress: HTMLDivElement;
    declare private _loadingNumber: HTMLSpanElement;

    constructor() {
        this._generateElement();

        LoaderManager.onProgress.add(this._onProgress);
    }

    private _generateElement(): void {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div id="loading-screen" class="loading-screen">
                <div class="loading-progress">
                    <span class="loading-number">0</span><span>%</span>
                </div>
                <div class="loading-bar"></div>
            </div>
        `.trim();

        this._htmlElement = wrapper.querySelector('#loading-screen')!;
        this._loadingProgress = this._htmlElement.querySelector('.loading-progress')!;
        this._loadingNumber = this._loadingProgress.querySelector('.loading-number')!;
        this._loadingBar = this._htmlElement.querySelector('.loading-bar')!;
    }

    private readonly _onProgress = (): void => {
        const progress = (LoaderManager.loadedSize / LoaderManager.totalSize) * 100;
        this._loadingBar.style.transform = `translateY(-50%) scaleX(${progress / 100})`;
        this._loadingNumber.textContent = Math.round(progress).toString();
    };

    public show(): void {
        this._loadingNumber.textContent = '0';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.remove('ended');
    }

    public hide(): void {
        this._loadingNumber.textContent = '100';
        this._loadingBar.style.transform = '';
        this._loadingBar.classList.add('ended');
    }

    //#region
    //
    public get htmlElement(): HTMLDivElement {
        return this._htmlElement;
    }
    //
    //#endregion
}
