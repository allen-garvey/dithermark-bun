precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform float u_contrast;

// code to adjust contrast based on:https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/brightnesscontrast.js
// u_contrast -1 to 2 (-1 is solid gray, 0 is no change, and 2 is maximum contrast)

void main(){
    vec4 pixel = texture2D(u_texture, v_texcoord);
    vec3 adjustedPixel = pixel.rgb;

    if(u_contrast >= 0.0){
        adjustedPixel = (adjustedPixel - 0.5) / (1.0 - u_contrast) + 0.5;
    }
    else {
        adjustedPixel = (adjustedPixel - 0.5) * (1.0 + u_contrast) + 0.5;
    }
    gl_FragColor = vec4(adjustedPixel, pixel.a);
}