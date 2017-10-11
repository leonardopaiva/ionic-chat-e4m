import { Response } from '@angular/http';
import { Observable } from 'rxjs';

const extractError = (error: Response | any): string => {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);

    return errMsg;
}

//por ser abstract está dizendo que essa classe será apenas herdada por 
//outras classes, nunca poderá ser criada uma instancia dessa classe
//poderia ser uma interface, porém não poderia implementar os métodos, 
//apenas os definir
//protected: significa que esses métodos serao enxergados por classes que
//extendem a baseservice, private não conseguiria enxergar eles lá dentro
//public se pudesse instanciar essa classe.
//basicamente serve para que as classes que herdarem base service, sejam capaz 
//de usar os métodos public e protected de baseservice.
export abstract class BaseService {

    protected handlePromiseError(error: Response | any): Promise<any> {
        return Promise.reject(extractError(error));
    }

    protected handleObservableError(error: Response | any): Observable<any> {
        return Observable.throw(extractError(error));
    }

}