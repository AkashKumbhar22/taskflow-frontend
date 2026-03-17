import React, { useState } from 'react';

const TaskForm = ({ onTaskCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (taskName.trim().length < 3) {
      setError('Task name must be at least 3 characters');
      return;
    }

    if (taskName.trim().length > 255) {
      setError('Task name must be less than 255 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await onTaskCreated({ 
        name: taskName.trim(), 
        priority 
      });
      
      // Success - Clear form
      setTaskName('');
      setPriority('MEDIUM');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error creating task:', err);
      
      if (err.response?.data?.errors) {
        // Validation errors from backend
        const validationErrors = err.response.data.errors
          .map(e => e.message)
          .join(', ');
        setError(validationErrors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create task. Make sure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTaskName('');
    setPriority('MEDIUM');
    setError('');
    setSuccess(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        <svg 
          className="w-6 h-6 text-purple-600 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name Input */}
        <div>
          <label 
            htmlFor="taskName" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Task Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Enter task name (min 3 characters)..."
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {taskName.length}/255 characters
          </p>
        </div>

        {/* Priority Select */}
        <div>
          <label 
            htmlFor="priority" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={loading}
          >
            <option value="HIGH">🔴 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Low Priority</option>
          </select>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Task created successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || taskName.trim().length < 3}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5 mr-2" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Create Task
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Form Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Tasks are created with "QUEUED" status by default. 
          You can edit them after creation.
        </p>
      </div>
    </div>
  );
};

export default TaskForm;