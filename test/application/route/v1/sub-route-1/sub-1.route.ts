import { Route } from '../../../../../src/declarations/route';
import { route } from '../../../../../src/annotation/route';
import { Sub1Controller } from './sub-1.controller';

@route({
  controller: Sub1Controller,
})
export class Sub1Route extends Route {}
