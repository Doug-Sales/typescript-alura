export function escape(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const metodoOriginal = descriptor.value;

    descriptor.value = function (...args: any[]) {
        /* console.log(`@escape em ação na classe
        ${this.constructor.name} para o método ${propertyKey}`); */

        let retorno = metodoOriginal.apply(this, args);
        if (typeof retorno === 'string') {
            retorno = retorno
                .replace(/<script>[\s\S]*?<\/script>/, '');
        }
        return retorno;
    }
    return descriptor;
}




