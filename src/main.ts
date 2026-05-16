import './style.css'
import { sampleTransactions } from './data/transactions'
import {
  buildMonthlySnapshot,
  calculateNetBalance,
  calculateTotalByType,
  formatCurrency,
  getTopCategories,
  summarizeByCategory,
  validateTransaction,
} from './utils/finance'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

const incomeTotal = calculateTotalByType(sampleTransactions, 'income')
const expenseTotal = calculateTotalByType(sampleTransactions, 'expense')
const netBalance = calculateNetBalance(sampleTransactions)
const categoryTotals = summarizeByCategory(sampleTransactions)
const topCategories = getTopCategories(categoryTotals, 4)
const snapshot = buildMonthlySnapshot(sampleTransactions, '2026-05')
const validationIssues = sampleTransactions
  .map((transaction) => ({
    id: transaction.id,
    errors: validateTransaction(transaction),
  }))
  .filter((result) => result.errors.length > 0)

const transactionsMarkup = sampleTransactions
  .map((transaction) => {
    const signedAmount =
      transaction.type === 'expense' ? -transaction.amount : transaction.amount
    return `
      <tr>
        <td>${transaction.date}</td>
        <td>${transaction.name}</td>
        <td>${transaction.category}</td>
        <td class="tag ${transaction.type}">${transaction.type}</td>
        <td class="amount ${transaction.type}">${formatCurrency(
          signedAmount
        )}</td>
      </tr>
    `
  })
  .join('')

const categoryMarkup = topCategories
  .map(
    (entry) => `
    <li>
      <span>${entry.category}</span>
      <strong>${formatCurrency(entry.total)}</strong>
    </li>
  `
  )
  .join('')

app.innerHTML = `
  <main>
    <header>
      <div>
        <p class="eyebrow">Smart Budget Planner</p>
        <h1>Budget Beacon</h1>
        <p class="subtitle">
          Track income, control spending, and highlight savings opportunities
          with an AI-assisted budgeting snapshot.
        </p>
      </div>
      <div class="hero-card">
        <p class="label">Net balance</p>
        <p class="value">${formatCurrency(netBalance)}</p>
        <p class="meta">${snapshot.count} transactions logged in May</p>
      </div>
    </header>

    <section class="metrics">
      <div class="card">
        <p class="label">Total income</p>
        <p class="value">${formatCurrency(incomeTotal)}</p>
        <p class="meta">Deposits across 2 pay sources</p>
      </div>
      <div class="card">
        <p class="label">Total expenses</p>
        <p class="value">${formatCurrency(-expenseTotal)}</p>
        <p class="meta">${formatCurrency(snapshot.expenses)} spent this month</p>
      </div>
      <div class="card">
        <p class="label">Monthly net</p>
        <p class="value">${formatCurrency(snapshot.net)}</p>
        <p class="meta">Planned savings: 20%</p>
      </div>
    </section>

    <section class="split">
      <div class="panel">
        <h2>Top spending categories</h2>
        <ul class="categories">
          ${categoryMarkup}
        </ul>
      </div>
      <div class="panel">
        <h2>Budget health</h2>
        <div class="health">
          <div>
            <p class="label">Income to expense ratio</p>
            <p class="value">${(incomeTotal / expenseTotal).toFixed(2)}x</p>
          </div>
          <div>
            <p class="label">Largest expense</p>
            <p class="value">${formatCurrency(categoryTotals.Housing)}</p>
          </div>
          <div>
            <p class="label">Savings runway</p>
            <p class="value">${formatCurrency(netBalance / 3)}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="section-header">
        <h2>Recent transactions</h2>
        <p>${sampleTransactions.length} records synced</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${transactionsMarkup}
        </tbody>
      </table>
    </section>

    ${
      validationIssues.length > 0
        ? `
      <section class="alert">
        <strong>${validationIssues.length} validation warnings</strong>
        <p>Review transactions with missing data before exporting.</p>
      </section>
    `
        : ''
    }
  </main>
`
