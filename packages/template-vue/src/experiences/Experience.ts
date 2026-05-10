import './styles/style.scss';

import InitCommand from './commands/InitCommand';
import MainThreeEngine from './engines/threes/MainThreeEngine';
import MainVueEngine from './engines/vues/MainVueEngine';
import LoaderManager from './managers/LoaderManager';

class Experience {
    private _isInitialized = false;

    public async init(): Promise<void> {
        if (this._isInitialized) return;
        this._isInitialized = true;

        InitCommand.init();
        MainVueEngine.init();
        MainThreeEngine.init();

        await LoaderManager.loadAssetsWithTransition(this._onReady);
    }

    private readonly _onReady = async (): Promise<void> => {
        await MainThreeEngine.setEntryView();
    };
}

export default new Experience();
