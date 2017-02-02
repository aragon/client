// @flow
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import Company from './deployed'

const Transactions = new Mongo.Collection('transactions', { connection: null })
const AccountingPeriods = new Mongo.Collection('accountingPeriod', { connection: null })

class Accounting {
  Transactions: Mongo.Collection
  persistentTransactions: PersistentMinimongo
  AccountingPeriods: Mongo.Collection
  persistentAccountingPeriods: PersistentMinimongo

  constructor() {
    this.setupCollections()
  }

  listen() {
    this.listenForChanges()
  }

  setupCollections() {
    this.Transactions = Transactions
    this.persistentTransactions = new PersistentMinimongo(this.Transactions)

    this.AccountingPeriods = AccountingPeriods
    this.persistentAccountingPeriods = new PersistentMinimongo(this.AccountingPeriods)
  }

  listenForChanges() {
    if (this.lastWatchedBlock > this.lastBlock) {
      this.lastWatchedBlock = this.lastBlock
    }
    const threshold = this.lastBlock
    const missedPredicate = { fromBlock: Math.max(0, this.lastWatchedBlock - 10000), toBlock: threshold }
    const streamingPredicate = { fromBlock: threshold, toBlock: 'latest' }

    Company().NewPeriod({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchPeriod(err, ev)))
    Company().NewPeriod({}, streamingPredicate).watch((err, ev) => this.watchPeriod(err, ev))

    Company().PeriodClosed({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchPeriod(err, ev)))
    Company().PeriodClosed({}, streamingPredicate).watch((err, ev) => this.watchPeriod(err, ev))

    Company().NewRecurringTransaction({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchRecurring(err, ev)))
    Company().NewRecurringTransaction({}, streamingPredicate).watch((err, ev) => this.watchRecurring(err, ev))

    Company().TransactionSaved({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchTransaction(err, ev)))
    Company().TransactionSaved({}, streamingPredicate).watch((err, ev) => this.watchTransaction(err, ev))

    Company().NewRecurringTransaction({}, missedPredicate).get((err, evs) =>
      evs.map(ev => this.watchRecurringRemoval(err, ev)))
    Company().NewRecurringTransaction({}, streamingPredicate).watch((err, ev) => this.watchRecurringRemoval(err, ev))
  }

  watchPeriod(err, ev) {
    if (!err) this.updatePeriod(ev.args.newPeriod.toNumber())
    this.lastWatchedBlock = ev.blockNumber
  }

  watchRecurring(err, ev) {
    if (!err) this.saveRecurringTransaction(ev.args.recurringIndex.toNumber())
    this.lastWatchedBlock = ev.blockNumber
  }

  watchTransaction(err, ev) {
    if (!err) this.saveTransaction(ev.args.period.toNumber(), ev.args.transactionIndex.toNumber())
    this.lastWatchedBlock = ev.blockNumber
  }

  watchRecurringRemoval(err, ev) {
    if (!err) this.removeRecurringTransaction(ev.args.recurringIndex.toNumber())
    this.lastWatchedBlock = ev.blockNumber
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

  get lastBlockKey() {
    return 'lB_acc'
  }

  get lastWatchedBlock() {
    return Session.get(this.lastBlockKey) || EthBlocks.latest.number
  }

  get lastBlock() {
    return EthBlocks.latest.number
  }

  set lastWatchedBlock(block) {
    return Session.setPersistent(this.lastBlockKey, block)
  }

}

export default new Accounting()
