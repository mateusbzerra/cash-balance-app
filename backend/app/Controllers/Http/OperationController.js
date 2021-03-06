'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Operation = use('App/Models/Operation');

class OperationController {
  async index({ request, response, params }) {
    const query = request.all();
    let month = Number(new Date().getMonth() + 1);
    let year = Number(new Date().getFullYear());
    if (query.month) {
      month = Number(query.month);
    }
    if (query.year) {
      year = Number(query.year);
    }
    const operations = await Operation.query()
      .whereRaw(
        'EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?',
        [month, year]
      )
      .fetch();
    const [{ incoming }] = await Operation.query()
      .whereRaw(
        'EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?',
        [month, year]
      )
      .andWhere({ incoming: true })
      .sum('value as incoming');
    const [{ outcoming }] = await Operation.query()
      .whereRaw(
        'EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?',
        [month, year]
      )
      .andWhere({ incoming: false })
      .sum('value as outcoming');
    const previousMonth = Number(month - 1);
    let previousYear = year;
    if (Number(month) === 1) {
      previousYear = year - 1;
    }
    const [{ previousIncoming }] = await Operation.query()
      .where({ incoming: true })
      .sum('value as previousIncoming');
    const [{ previousOutcoming }] = await Operation.query()
      .where({ incoming: false })
      .sum('value as previousOutcoming');

    return {
      operations,
      month,
      year,

      balance: {
        total: Number(previousIncoming - previousOutcoming), //+ Number(previousIncoming - previousOutcoming)Number(incoming),
        incoming: Number(incoming),
        outcoming: Number(outcoming)
      }
    };
  }

  async store({ request, response, params }) {
    const data = request.only([
      'description',
      'value',
      'date',
      'incoming',
      'type'
    ]);
    let newValue = data.value;
    if (typeof newValue === 'string') {
      newValue = newValue.replace(',', '.');
    }
    newValue = newValue * 1000;
    data.value = newValue;

    const operation = await Operation.create(data);
    return operation;
  }

  async show({ params, request, response, view }) {
    const { id } = params;

    const operation = await Operation.find(id).first();
    return operation;
  }

  async update({ params, request, response }) {}

  async destroy({ params, request, response }) {}
}

module.exports = OperationController;
