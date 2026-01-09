
export default abstract class HTMLViewBase {
    declare protected _htmlElement: HTMLDivElement;

    constructor() {
        this._getElement();
    }

    protected _getElement(): void {
        //
    }

    public show(): void {
        this._htmlElement.classList.add('show');
        this._htmlElement.classList.remove('hidden');
    }

    public hide(): void {
        this._htmlElement.classList.add('hidden');
        this._htmlElement.classList.remove('show');
    }
}
