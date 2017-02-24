// @flow
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import Company from './deployed'

import Watcher from './watcher'

const Transactions = new Mongo.Collection('transactions', { connection: null })
const AccountingPeriods = new Mongo.Collection('accountingPeriod', { connection: null })

class AccountingWatcher extends Watcher {
  Transactions: Mongo.Collection
  persistentTransactions: PersistentMinimongo
  AccountingPeriods: Mongo.Collection
  persistentAccountingPeriods: PersistentMinimongo

  constructor() {
    super('acc')
    this.setupCollections()
  }

  listen() {
    this.watchEvent(Company().NewPeriod, this.watchPeriod)
    this.watchEvent(Company().PeriodClosed, this.watchPeriod)
    this.watchEvent(Company().NewRecurringTransaction, this.watchRecurring)
    this.watchEvent(Company().TransactionSaved, this.watchTransaction)
    this.watchEvent(Company().RemovedRecurringTransaction, this.watchRecurringRemoval)
  }

  setupCollections() {
    this.Transactions = Transactions
    this.persistentTransactions = new PersistentMinimongo(this.Transactions)

    this.AccountingPeriods = AccountingPeriods
    this.persistentAccountingPeriods = new PersistentMinimongo(this.AccountingPeriods)
  }

  watchPeriod(err, ev) {
    if (!err) this.updatePeriod(ev.args.newPeriod.toNumber())

  }

  watchRecurring(err, ev) {
    if (!err) this.saveRecurringTransaction(ev.args.recurringIndex.toNumber())

  }

  watchTransaction(err, ev) {
    if (!err) this.saveTransaction(ev.args.period.toNumber(), ev.args.transactionIndex.toNumber())

  }

  watchRecurringRemoval(err, ev) {
    if (!err) this.removeRecurringTransaction(ev.args.recurringIndex.toNumber())

  }

  get currentPeriod() {
    return this.AccountingPeriods.findOne({}, { sort: { index: -1 } })
  }

  async updatePeriod(periodIndex) {
    const periodArray = await Company().getPeriodInfo(periodIndex)
    const [transactions, startedDate, endedDate, revenue, expenses, dividends] = periodArray

    const periodInfo = {
      index: periodIndex,
      startedDate: new Date(startedDate * 1000),
      endedDate: endedDate > 0 ? new Date(endedDate * 1000) : null,
      revenue: revenue.toNumber(),
      expenses: expenses.toNumber(),
      dividends: dividends.toNumber(),
      transactions: transactions.toNumber(),
    }

    this.AccountingPeriods.upsert(`p_${periodIndex}`, periodInfo)
  }

  async saveTransaction(periodIndex, transactionIndex) {
    console.log('fetching tx')
    const txArray = await Company().getTransactionInfo(periodIndex, transactionIndex)
    const [isExpense, from, to, approvedBy, amount, concept, timestamp] = txArray

    const txInfo = {
      recurring: false,

      periodIndex,
      transactionIndex,
      isExpense,
      from,
      to,
      approvedBy,
      amount: amount.toNumber(),
      concept,
      timestamp: timestamp.toNumber(),
    }

    console.log('fetching tx', txInfo)

    this.Transactions.upsert(`p_${periodIndex}t_${transactionIndex}`, txInfo)
  }

  async saveRecurringTransaction(index) {
    const txArray = await Company().getRecurringTransactionInfo(index)
    const [period, lastTransactionDate, to, approvedBy, amount, concept] = txArray

    const txInfo = {
      recurring: true,
      isExpense: true,

      period: period.toNumber(),
      index,
      to,
      approvedBy,
      amount: amount.toNumber(),
      concept,
      lastTransactionDate: new Date(lastTransactionDate * 1000),
    }

    this.Transactions.upsert(`rt_${index}`, txInfo)
  }

  removeRecurringTransaction(index) {
    this.Transactions.remove({ recurring: true, index })
  }
}

export default new AccountingWatcher()
