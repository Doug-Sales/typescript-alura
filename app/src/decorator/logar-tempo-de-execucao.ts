// Requisito não funcional
export function logarTempoDeExecucao(emSegundos: boolean = false) {
    return function (
        target: any,  // *1
        propertyKey: string, // *2
        descriptor: PropertyDescriptor // *3
    ) {
        const metodoOriginal = descriptor.value;

        descriptor.value = function (...args: any[]) {  // ou: Array<any>
            let divisor = 1;
            let unidade = 'milisegundos'
            if (emSegundos) {
                divisor = 1000;
                unidade = 'segundos';
            }

            const t1 = performance.now();

            const retorno = metodoOriginal.apply(this, args);

            const t2 = performance.now();
            console.log(`${propertyKey}, tempo de execução: ${(t2 - t1) / divisor} ${unidade}`);

            retorno
        };
        return descriptor;
    }
}
// *1 - Se aplicado no método statico se torna a função construtora, se não, retorna o prototype(das heranças tbm) da classe.
// *2 - Nome do método como string que foi decorado
// *3 - Sabe tudo sobre o método que queremos executar, tem referencia do método original. 
