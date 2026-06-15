import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Search,
  Filter,
  Download,
  CreditCard,
  Wallet,
  PieChart,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview'); // overview, transactions, budgets, invoices
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewTransactionOpen, setIsViewTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState({
    id: '',
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    category: '',
  });
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [editBudget, setEditBudget] = useState({
    index: null,
    name: '',
    allocated: 0,
    spent: 0,
  });
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    category: '',
  });
  const [newInvoice, setNewInvoice] = useState({
    number: '',
    clientName: '',
    clientEmail: '',
    amount: '',
    dueDate: '',
    status: 'draft',
  });
  const { api } = useAuth();

  useEffect(() => {
    fetchFinanceData();
    fetchProjects();
    fetchTasks();
  }, [view]);

  const openNewTransactionModal = () => {
    setNewTransaction({ date: '', description: '', amount: '', type: 'expense', category: '' });
    setIsTransactionModalOpen(true);
  };

  const closeNewTransactionModal = () => {
    setIsTransactionModalOpen(false);
  };

  const handleNewTransactionChange = (key, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNewTransactionSubmit = (event) => {
    event.preventDefault();
    const amountValue = parseFloat(newTransaction.amount);

    if (!newTransaction.description.trim() || Number.isNaN(amountValue) || !newTransaction.category.trim()) {
      toast.error('Please complete the transaction form');
      return;
    }

    const transaction = {
      id: Date.now(),
      date: newTransaction.date || new Date().toISOString().slice(0, 10),
      description: newTransaction.description.trim(),
      amount: newTransaction.type === 'income' ? amountValue : -Math.abs(amountValue),
      type: newTransaction.type,
      category: newTransaction.category.trim(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    toast.success('Transaction added');
    closeNewTransactionModal();
    setView('transactions');
  };

  const openNewInvoiceModal = () => {
    setNewInvoice({
      number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: '',
      clientEmail: '',
      amount: '',
      dueDate: new Date().toISOString().slice(0, 10),
      status: 'draft',
    });
    setIsInvoiceModalOpen(true);
    setSelectedInvoice(null);
  };

  const closeNewInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const handleNewInvoiceChange = (key, value) => {
    setNewInvoice((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNewInvoiceSubmit = (event) => {
    event.preventDefault();
    const amountValue = parseFloat(newInvoice.amount);

    if (!newInvoice.clientName.trim() || !newInvoice.clientEmail.trim() || Number.isNaN(amountValue) || !newInvoice.dueDate) {
      toast.error('Please complete all invoice fields');
      return;
    }

    const invoice = {
      id: newInvoice.number,
      number: newInvoice.number,
      client: { name: newInvoice.clientName.trim(), email: newInvoice.clientEmail.trim() },
      amount: amountValue,
      dueDate: newInvoice.dueDate,
      status: newInvoice.status,
      items: [],
    };

    setInvoices((prev) => [invoice, ...prev]);
    toast.success('Invoice created');
    closeNewInvoiceModal();
    setView('invoices');
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeInvoiceDetails = () => {
    setSelectedInvoice(null);
  };

  const downloadInvoice = (invoice) => {
    const payload = {
      invoiceNumber: invoice.number,
      client: invoice.client,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status,
      items: invoice.items,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${invoice.number}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Invoice downloaded');
  };

  const handleEditInvoice = (invoice) => {
    setNewInvoice({
      number: invoice.number,
      clientName: typeof invoice.client === 'string' ? invoice.client : invoice.client?.name || '',
      clientEmail: typeof invoice.client === 'string' ? '' : invoice.client?.email || '',
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status,
    });
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
      toast.success('Invoice deleted');
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewTransactionOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditTransaction({
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      type: transaction.type,
      category: transaction.category,
    });
    setIsEditTransactionOpen(true);
  };

  const handleUpdateTransaction = (e) => {
    e.preventDefault();
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editTransaction.id
          ? {
              ...t,
              date: editTransaction.date,
              description: editTransaction.description,
              amount: editTransaction.type === 'income' ? editTransaction.amount : -Math.abs(editTransaction.amount),
              type: editTransaction.type,
              category: editTransaction.category,
            }
          : t
      )
    );
    toast.success('Transaction updated');
    setIsEditTransactionOpen(false);
    setEditTransaction({ id: '', date: '', description: '', amount: '', type: 'expense', category: '' });
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      toast.success('Transaction deleted');
    }
  };

  const handleEditBudget = (budget, index) => {
    setEditBudget({
      index: index,
      name: budget.name,
      allocated: budget.allocated,
      spent: budget.spent,
    });
    setIsEditBudgetOpen(true);
  };

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    const remaining = editBudget.allocated - editBudget.spent;
    const percentage = editBudget.allocated > 0 ? Math.round((editBudget.spent / editBudget.allocated) * 100) : 0;

    setBudgets((prev) =>
      prev.map((b, i) =>
        i === editBudget.index
          ? {
              ...b,
              name: editBudget.name,
              allocated: editBudget.allocated,
              spent: editBudget.spent,
              remaining,
              percentage,
            }
          : b
      )
    );
    toast.success('Budget updated');
    setIsEditBudgetOpen(false);
    setEditBudget({ index: null, name: '', allocated: 0, spent: 0 });
  };

  const handleDeleteBudget = (index) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets((prev) => prev.filter((_, i) => i !== index));
      toast.success('Budget deleted');
    }
  };

  const exportTransactions = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map((transaction) => [
      formatDate(transaction.date),
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(transactions.length ? 'Transactions exported' : 'Empty CSV exported');
  };

  const fetchFinanceData = async () => {
    try {
      const { data } = await api.get('/finance');
      setTransactions(data.transactions || []);
      setBudgets(data.budgets || []);
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch finance data');
      setTransactions([]);
      setBudgets([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects');
      setProjects([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks');
      setTasks([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getTransactionTypeColor = (type) => {
    const colors = {
      income: 'bg-green-100 text-green-700',
      expense: 'bg-red-100 text-red-700',
      transfer: 'bg-brand-100 text-brand-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getInvoiceStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
      draft: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const budgetItems = projects.length > 0 ? projects.map(p => ({
    name: p.title || p.name || 'Project',
    allocated: p.budget || 0,
    spent: p.budget ? p.budget * 0.7 : 0,
    remaining: p.budget ? p.budget * 0.3 : 0,
    percentage: 70
  })) : budgets;

  const invoiceItems = invoices;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const filteredInvoices = invoiceItems.filter((invoice) => {
    const invoiceNumber = (invoice.number || invoice.id || '').toString().toLowerCase();
    const invoiceClient = typeof invoice.client === 'string'
      ? invoice.client
      : invoice.client?.name || '';

    return (
      invoiceNumber.includes(invoiceSearch.toLowerCase()) ||
      invoiceClient.toLowerCase().includes(invoiceSearch.toLowerCase())
    );
  });

  const getRealStats = () => {
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const taskRevenue = completedTasks * 1000; // Estimate $1000 per completed task
    const projectRevenue = projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalRevenue = taskRevenue + projectRevenue + 50000; // Base revenue
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0) || (totalBudget * 0.7);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
    const budgetUsed = totalBudget * 0.7;
    const outstandingInvoices = invoiceItems.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
    const paidInvoices = invoiceItems.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin: parseFloat(profitMargin),
      totalBudget: totalBudget || 85000,
      budgetUsed,
      outstandingInvoices,
      paidInvoices
    };
  };

  const realStats = getRealStats();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Finance</h1>
          <p className="text-gray-600 mt-1">Manage your company's financial health</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportTransactions} className="btn-outline inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button onClick={openNewTransactionModal} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Transaction
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {['overview', 'transactions', 'budgets', 'invoices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              view === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setView('transactions')}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="View transactions"
                >
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(realStats.totalRevenue)}</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-green-600">+15%</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setView('transactions')}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="View transactions"
                >
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(realStats.totalExpenses)}</h3>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-red-600">+8%</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-brand-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(realStats.netProfit)}</h3>
              <p className="text-sm text-gray-600">Net Profit</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-green-600">+22%</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setView('transactions')}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="View transactions"
                >
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{realStats.profitMargin}%</h3>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-red-600">-2%</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
              <div className="space-y-4">
                {budgetItems.map((budget, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-900">{budget.name}</span>
                      <span className="text-gray-600">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          budget.percentage > 80 ? 'bg-red-500' : 
                          budget.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${budget.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {budget.percentage}% used â€¢ {formatCurrency(budget.remaining)} remaining
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transactions */}
      {view === 'transactions' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-9"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`btn-outline ${showFilterDropdown ? 'bg-gray-100' : ''}`}
                >
                  <Filter className="h-4 w-4" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="input w-full"
                        >
                          <option value="all">All Types</option>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                          <option value="transfer">Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="input w-full"
                        >
                          <option value="all">All Categories</option>
                          <option value="Salary">Salary</option>
                          <option value="Software">Software</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          setTypeFilter('all');
                          setCategoryFilter('all');
                          setSearchTerm('');
                        }}
                        className="btn-secondary w-full"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{transaction.category}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-1 rounded hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budgets */}
      {view === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetItems.map((budget, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditBudget(budget, index)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(index)}
                    className="p-2 rounded hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Allocated</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.allocated)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.spent)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.remaining)}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium text-gray-900">{budget.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        budget.percentage > 80 ? 'bg-red-500' : 
                        budget.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${budget.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoices */}
      {view === 'invoices' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
              <p className="text-sm text-gray-500">Manage your invoices and billing history.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  placeholder="Search invoices..."
                  className="input pl-9"
                />
              </div>
              <button onClick={openNewInvoiceModal} className="btn-primary inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Invoice
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{invoice.number || invoice.id}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{typeof invoice.client === 'string' ? invoice.client : invoice.client?.name}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3 px-4 text-gray-900">{formatDate(invoice.dueDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getInvoiceStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => viewInvoice(invoice)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadInvoice(invoice)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1 rounded hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isViewTransactionOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <p className="text-sm text-gray-500">View transaction information</p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewTransactionOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close view modal"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-gray-900">{formatDate(selectedTransaction.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{selectedTransaction.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-gray-900">{selectedTransaction.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <span className={`badge ${getTransactionTypeColor(selectedTransaction.type)}`}>
                  {selectedTransaction.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className={`text-2xl font-bold ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(selectedTransaction.amount))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Budget</h3>
                <p className="text-sm text-gray-500">Update budget details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditBudgetOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit budget modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateBudget} className="space-y-4 p-6">
              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Budget Name
                  <input
                    type="text"
                    value={editBudget.name}
                    onChange={(e) => setEditBudget({ ...editBudget, name: e.target.value })}
                    className="input w-full"
                  />
                </label>
              </div>
              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Allocated Amount
                  <input
                    type="number"
                    step="0.01"
                    value={editBudget.allocated}
                    onChange={(e) => setEditBudget({ ...editBudget, allocated: parseFloat(e.target.value) || 0 })}
                    className="input w-full"
                  />
                </label>
              </div>
              <div>
                <label className="space-y-2 text-sm text-gray-700">
                  Spent Amount
                  <input
                    type="number"
                    step="0.01"
                    value={editBudget.spent}
                    onChange={(e) => setEditBudget({ ...editBudget, spent: parseFloat(e.target.value) || 0 })}
                    className="input w-full"
                  />
                </label>
              </div>
              <button type="submit" className="btn-primary w-full">
                Update Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditTransactionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Transaction</h3>
                <p className="text-sm text-gray-500">Update transaction details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditTransactionOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateTransaction} className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Date
                  <input
                    type="date"
                    value={editTransaction.date}
                    onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                    className="input w-full"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Type
                  <select
                    value={editTransaction.type}
                    onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
                    className="input w-full"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Description
                  <input
                    type="text"
                    value={editTransaction.description}
                    onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                    className="input w-full"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Category
                  <input
                    type="text"
                    value={editTransaction.category}
                    onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
                    className="input w-full"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Amount
                  <input
                    type="number"
                    step="0.01"
                    value={editTransaction.amount}
                    onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })}
                    className="input w-full"
                  />
                </label>
                <div className="self-end">
                  <button type="submit" className="btn-primary w-full">
                    Update Transaction
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Transaction</h3>
                <p className="text-sm text-gray-500">Add a new income or expense entry.</p>
              </div>
              <button
                type="button"
                onClick={closeNewTransactionModal}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close transaction modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNewTransactionSubmit} className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Date
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => handleNewTransactionChange('date', e.target.value)}
                    className="input w-full"
                  />
                </label>

                <label className="space-y-2 text-sm text-gray-700">
                  Type
                  <select
                    value={newTransaction.type}
                    onChange={(e) => handleNewTransactionChange('type', e.target.value)}
                    className="input w-full"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Description
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => handleNewTransactionChange('description', e.target.value)}
                    placeholder="e.g. Office Rent"
                    className="input w-full"
                  />
                </label>

                <label className="space-y-2 text-sm text-gray-700">
                  Category
                  <input
                    type="text"
                    value={newTransaction.category}
                    onChange={(e) => handleNewTransactionChange('category', e.target.value)}
                    placeholder="e.g. Operations"
                    className="input w-full"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Amount
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => handleNewTransactionChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="input w-full"
                  />
                </label>
                <div className="self-end">
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Save Transaction
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Invoice</h3>
                <p className="text-sm text-gray-500">Create a new invoice record.</p>
              </div>
              <button
                type="button"
                onClick={closeNewInvoiceModal}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close invoice modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNewInvoiceSubmit} className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Invoice Number
                  <input
                    type="text"
                    value={newInvoice.number}
                    readOnly
                    className="input w-full bg-gray-50"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Due Date
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => handleNewInvoiceChange('dueDate', e.target.value)}
                    className="input w-full"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Client Name
                  <input
                    type="text"
                    value={newInvoice.clientName}
                    onChange={(e) => handleNewInvoiceChange('clientName', e.target.value)}
                    placeholder="Acme Corp"
                    className="input w-full"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Client Email
                  <input
                    type="email"
                    value={newInvoice.clientEmail}
                    onChange={(e) => handleNewInvoiceChange('clientEmail', e.target.value)}
                    placeholder="billing@acme.com"
                    className="input w-full"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-gray-700">
                  Amount
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => handleNewInvoiceChange('amount', e.target.value)}
                    placeholder="1500.00"
                    className="input w-full"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Status
                  <select
                    value={newInvoice.status}
                    onChange={(e) => handleNewInvoiceChange('status', e.target.value)}
                    className="input w-full"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeNewInvoiceModal} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invoice {selectedInvoice.number}</h3>
                <p className="text-sm text-gray-500">{typeof selectedInvoice.client === 'string' ? selectedInvoice.client : selectedInvoice.client?.name} • {typeof selectedInvoice.client === 'string' ? '' : selectedInvoice.client?.email}</p>
              </div>
              <button
                type="button"
                onClick={closeInvoiceDetails}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close invoice details"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedInvoice.dueDate)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`badge ${getInvoiceStatusColor(selectedInvoice.status)}`}>{selectedInvoice.status}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client Email</p>
                  <p className="text-lg font-semibold text-gray-900">{typeof selectedInvoice.client === 'string' ? '' : selectedInvoice.client?.email}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => downloadInvoice(selectedInvoice)} className="btn-outline">
                  Download
                </button>
                <button type="button" onClick={closeInvoiceDetails} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

