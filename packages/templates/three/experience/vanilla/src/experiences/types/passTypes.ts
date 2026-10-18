import { Uniform } from 'three';

export interface PassShader {
    uniforms?: Record<string, Uniform>;
    vertexShader: string;
    fragmentShader: string;
    defines?: Record<string, unknown>;
}
