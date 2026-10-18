import { Uniform } from 'three';
import TemplatePassFragmentShader from '../../../../shaders/threes/composers/passes/templates/TemplatePassFragmentShader.glsl';
import TemplatePassVertexShader from '../../../../shaders/threes/composers/passes/templates/TemplatePassVertexShader.glsl';
import ThreePassBase from '../../bases/passes/ThreePassBase';

export default class TemplateThreePass extends ThreePassBase {
    constructor() {
        super({
            uniforms: {
                tDiffuse: new Uniform(null),
                uTime: new Uniform(0),
            },
            vertexShader: TemplatePassVertexShader,
            fragmentShader: TemplatePassFragmentShader,
        });
    }

    public update(dt: number): void {
        this.uniforms.uTime.value += dt;
    }
}
