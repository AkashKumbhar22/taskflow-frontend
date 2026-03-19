import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from './services/api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterBar from './components/FilterBar';

function App() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [backendHealth, setBackendHealth] = useState(null);

  // ✅ KEEP stats (NOW USED)
  const [stats, setStats] = useState({
    total: 0,
    queued: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  });

  const calculateStats = useCallback((taskList) => {
    const newStats = {
      total: taskList.length,
      queued: taskList.filter(t => t.status === 'QUEUED').length,
      inProgress: taskList.filter(t => t.status === 'IN_PROGRESS').length,
      completed: taskList.filter(t => t.status === 'COMPLETED').length,
      failed: taskList.filter(t => t.status === 'FAILED').length,
    };
    setStats(newStats);
  }, []);

const checkBackendHealth = useCallback(async () => {
  try {
    const response = await taskAPI.getHealth();

    console.log("Health Response:", response.data);

    if (response?.data?.status === "UP") {
      setBackendHealth("UP");
    } else {
      setBackendHealth("DOWN");
    }

  } catch (err) {
    console.error('Health check failed:', err);
    setBackendHealth('DOWN');
  }
}, []);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const loadTasksByStatus = useCallback(async (status) => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getTasksByStatus(status);
      setTasks(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error('Error filtering by status:', err);
      setError('Failed to filter tasks by status');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const loadTasksByPriority = useCallback(async (priority) => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getTasksByPriority(priority);
      setTasks(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error('Error filtering by priority:', err);
      setError('Failed to filter tasks by priority');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const searchTasks = useCallback(async (keyword) => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.searchTasks(keyword);
      setTasks(response.data);
      calculateStats(response.data);
    } catch (err) {
      console.error('Error searching tasks:', err);
      setError('Failed to search tasks');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadTasks();
    checkBackendHealth();

    const healthInterval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(healthInterval);
  }, [loadTasks, checkBackendHealth]);

  useEffect(() => {
    if (filterStatus) {
      loadTasksByStatus(filterStatus);
    } else if (filterPriority) {
      loadTasksByPriority(filterPriority);
    } else if (searchKeyword) {
      searchTasks(searchKeyword);
    } else {
      loadTasks();
    }
  }, [
    filterStatus,
    filterPriority,
    searchKeyword,
    loadTasks,
    loadTasksByPriority,
    loadTasksByStatus,
    searchTasks
  ]);

  const handleCreateTask = async (taskData) => {
    await taskAPI.createTask(taskData);
    loadTasks();
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      setError('');
      setLoading(true);

      const response = await taskAPI.updateTask(id, taskData);

      const updatedTasks = tasks.map(task =>
        task.id === id ? response.data : task
      );

      setTasks(updatedTasks);
      calculateStats(updatedTasks);

    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        loadTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task.');
      }
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setFilterStatus(value);
      setFilterPriority('');
      setSearchKeyword('');
    } else if (type === 'priority') {
      setFilterPriority(value);
      setFilterStatus('');
      setSearchKeyword('');
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setFilterStatus('');
    setFilterPriority('');
  };

  const handleReset = () => {
    setSearchKeyword('');
    setFilterStatus('');
    setFilterPriority('');
    loadTasks();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white">TaskFlow</h1>
          <p className="text-xl text-white">Manage Your Tasks Efficiently</p>

          {/* ✅ STATS DISPLAY (FIXED ERROR HERE) */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <span>Total: {stats.total}</span>
            <span>Queued: {stats.queued}</span>
            <span>In Progress: {stats.inProgress}</span>
            <span>Completed: {stats.completed}</span>
            <span>Failed: {stats.failed}</span>
          </div>

          <div className="mt-4">
            <span>
              Backend: {backendHealth || 'Checking...'}
            </span>
            <button onClick={checkBackendHealth} className="ml-4">
              Refresh
            </button>
          </div>
        </div>

        {error && <div>{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <TaskForm onTaskCreated={handleCreateTask} />

          <div className="lg:col-span-2">

            <FilterBar
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            {loading ? (
              <div>Loading...</div>
            ) : tasks.length === 0 ? (
              <div>No tasks found</div>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default App;