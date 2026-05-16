export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  name: string
  date: string
  category: string
  amount: number
  type: TransactionType
}

export interface CategoryTotal {
  category: string
  total: number
}

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}

export const calculateTotalByType = (
  transactions: Transaction[],
  type: TransactionType
): number =>
  transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)

export const calculateNetBalance = (transactions: Transaction[]): number => {
  const income = calculateTotalByType(transactions, 'income')
  const expenses = calculateTotalByType(transactions, 'expense')
  return income - expenses
}

export const summarizeByCategory = (
  transactions: Transaction[],
  type: TransactionType = 'expense'
): Record<string, number> =>
  transactions.reduce<Record<string, number>>((totals, transaction) => {
    if (transaction.type !== type) {
      return totals
    }

    totals[transaction.category] =
      (totals[transaction.category] ?? 0) + transaction.amount
    return totals
  }, {})

export const getTopCategories = (
  totals: Record<string, number>,
  limit = 3
): CategoryTotal[] =>
  Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((first, second) => second.total - first.total)
    .slice(0, limit)

export const validateTransaction = (transaction: Transaction): string[] => {
  const errors: string[] = []

  if (!transaction.name.trim()) {
    errors.push('name')
  }

  if (!transaction.category.trim()) {
    errors.push('category')
  }

  if (transaction.type !== 'income' && transaction.type !== 'expense') {
    errors.push('type')
  }

  if (!Number.isFinite(transaction.amount) || transaction.amount <= 0) {
    errors.push('amount')
  }

  if (Number.isNaN(Date.parse(transaction.date))) {
    errors.push('date')
  }

  return errors
}

export const buildMonthlySnapshot = (
  transactions: Transaction[],
  month: string
): { income: number; expenses: number; net: number; count: number } => {
  const monthlyTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(month)
  )
  const income = calculateTotalByType(monthlyTransactions, 'income')
  const expenses = calculateTotalByType(monthlyTransactions, 'expense')

  return {
    income,
    expenses,
    net: income - expenses,
    count: monthlyTransactions.length,
  }
}
