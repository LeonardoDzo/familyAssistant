import {MatPaginatorIntl} from '@angular/material';

export class CustomPaginator extends MatPaginatorIntl {
    itemsPerPageLabel = 'Elementos por página';
    nextPageLabel = 'Siguiente';
    previousPageLabel = 'Anterior' 
    getRangeLabel = (page,pageSize,length) => {
        return (length > 0)?"" + (page + 1) + " de " + Math.ceil(length/pageSize) : "";
    }
}