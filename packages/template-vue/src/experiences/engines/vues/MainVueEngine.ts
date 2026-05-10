import { createApp } from "vue";
import App from './MainVue.vue';

class MainVueEngine {
    public init(): void {
        createApp(App).mount('#app');
    }
}

export default new MainVueEngine();
