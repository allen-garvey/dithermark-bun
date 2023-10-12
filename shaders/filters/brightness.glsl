precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform float u_brightness;

// simplified version of https://stackoverflow.com/questions/1506299/applying-brightness-and-contrast-with-opengl-es
//u_brightness >= 0.0, where 1.0 is unchanged

void main(){
    vec4 pixel = texture2D(u_texture, v_texcoord);
    gl_FragColor = vec4(pixel.rgb * u_brightness, pixel.a);
}