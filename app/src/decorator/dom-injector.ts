export function domInjector(seletor: string) {

    return function (target: any, propertyKey: string) {
        // console.log(`Modificando prototype ${target.constructor.name}
        // e adicionando getter para a propriedade ${propertyKey}`);

        let elemento: HTMLElement; // ou  | null = null;

        const getter = function () {
            if (!elemento) { //Cache decorator para buscar apenas um vez.
                elemento = <HTMLElement>document.querySelector(seletor);
                // console.log(`buscando elemento do DOM com o seletor 
                //   ${seletor} para injetar em ${propertyKey}`);
            }

            return elemento;
        }

        Object.defineProperty(
            target, // retorna o prototype da classe.
            propertyKey, // retorna o nome da propriedade definida na classe
            { get: getter } // Setta um get para a propriedade, executando a função getter.
        );
 

    }
}







