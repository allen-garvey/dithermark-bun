export type Templator = (context: Record<string, string | number>) => string;

export const createTemplator =
    (template: string): Templator =>
    (context: Record<string, string | number>) => {
        let ret = template;
        for (const [key, value] of Object.entries(context)) {
            ret = ret.replaceAll(`#{{ ${key} }}`, value.toString());
        }

        return ret;
    };
