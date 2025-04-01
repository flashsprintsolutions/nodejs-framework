import { Route } from '../../../../../src/declarations/route';
import { route } from '../../../../../src/annotation/route';
import { Sub2Controller } from './sub-2.controller';

@route({
  controller: Sub2Controller,
})
export class Sub2Route extends Route {}
