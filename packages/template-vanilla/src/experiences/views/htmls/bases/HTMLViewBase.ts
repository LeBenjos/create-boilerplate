
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
    }

    public hide(): void {
        this._htmlElement.classList.remove('show');
    }
}
