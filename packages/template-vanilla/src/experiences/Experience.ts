import './styles/style.scss';

import InitCommand from './commands/InitCommand';
import MainHTML from './engines/htmls/MainHTML';
import MainThree from './engines/threes/MainThree';
import LoaderManager from './managers/LoaderManager';
import LoaderThree from './engines/threes/LoaderThree';

class Experience {
    private _isInitialized: boolean = false;

    public init(): void {
        if (this._isInitialized) return;
        this._isInitialized = true;

        InitCommand.init();
        MainHTML.init();
        LoaderThree.init();
        MainThree.init();
        void LoaderManager.loadAllAssets();
    }
}

export default new Experience();
