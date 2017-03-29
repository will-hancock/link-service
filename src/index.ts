import {logger} from './logger';
import {Container} from './service';

(new Container(logger))
    .getKoaService()
    .start();
