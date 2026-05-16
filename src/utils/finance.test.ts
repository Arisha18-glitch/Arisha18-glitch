import {
  buildMonthlySnapshot,
  calculateNetBalance,
  calculateTotalByType,
  formatCurrency,
  getTopCategories,
  summarizeByCategory,
  validateTransaction,
} from './finance'
import { sampleTransactions } from '../data/transactions'

describe('finance utilities', () => {
  it('formats currency using locale defaults', () => {
    expect(formatCurrency(2500, 'USD', 'en-US')).toBe('$2,500.00')
  })

  it('calculates totals by transaction type', () => {
    expect(calculateTotalByType(sampleTransactions, 'income')).toBe(5550)
    expect(calculateTotalByType(sampleTransactions, 'expense')).toBe(2493)
  })

  it('calculates net balance from income and expenses', () => {
    expect(calculateNetBalance(sampleTransactions)).toBe(3057)
  })

  it('summarizes expenses by category', () => {
    const totals = summarizeByCategory(sampleTransactions)
    expect(totals).toMatchObject({
      Housing: 1600,
      Food: 280,
      Transport: 120,
      Wellness: 55,
      Utilities: 18,
      Travel: 420,
    })
  })

  it('returns top categories by spend', () => {
    const totals = summarizeByCategory(sampleTransactions)
    expect(getTopCategories(totals, 3)).toEqual([
      { category: 'Housing', total: 1600 },
      { category: 'Travel', total: 420 },
      { category: 'Food', total: 280 },
    ])
  })

  it('validates transactions and returns issues', () => {
    const errors = validateTransaction({
      id: 'bad-1',
      name: '  ',
      date: 'not-a-date',
      category: '',
      amount: -5,
      type: 'expense',
    })

    expect(errors).toEqual(['name', 'category', 'amount', 'date'])
  })

  it('builds monthly snapshot totals', () => {
    expect(buildMonthlySnapshot(sampleTransactions, '2026-05')).toEqual({
      income: 5550,
      expenses: 2493,
      net: 3057,
      count: 8,
    })
  })
})
