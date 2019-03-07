import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Country } from '../../shared/models';

export const httpOptions = {
  headers: new HttpHeaders({  
    'Content-Type': 'application/json; charset=utf-8',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  public getCountries(): Observable<Country[]> {
    const url = `${environment.apiUrl}/all?fields=name;alpha2Code;callingCodes`;
    return this.http.get<Country[]>(url, httpOptions)
    .pipe(
      map(result => {
        return result;
      }),
      catchError(this.handleError('getCountries', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return Observable.throw(error);
    };
  }
}
