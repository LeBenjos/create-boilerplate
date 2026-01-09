import HTMLViewBase from '../../views/htmls/bases/HTMLViewBase';
import LoaderHTMLView from '../../views/htmls/loaders/LoaderHTMLView';

class MainHTML {
    private _views: HTMLViewBase[] = [];

    public init(): void {
        this._generateViews();
    }

    private _generateViews(): void {
        this._views.push(new LoaderHTMLView());
    }
}

export default new MainHTML();
