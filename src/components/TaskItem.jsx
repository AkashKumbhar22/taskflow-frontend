import React, { useState } from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedStatus, setEditedStatus] = useState(task.status); // ✅ ADDED
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'QUEUED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'QUEUED':
        return '⏳';
      case 'IN_PROGRESS':
        return '⚙️';
      case 'COMPLETED':
        return '✅';
      case 'FAILED':
        return '❌';
      default:
        return '📋';
    }
  };

  const handleSave = async () => {
    if (editedName.trim().length < 3) {
      alert('Task name must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(task.id, {
        name: editedName.trim(),
        priority: editedPriority,
        status: editedStatus, // ✅ ADDED
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(task.name);
    setEditedPriority(task.priority);
    setEditedStatus(task.status); // ✅ ADDED
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.name}"?`)) {
      setLoading(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 mb-4 hover:shadow-xl transition-shadow duration-200 border-l-4 border-purple-500">
      {isEditing ? (
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {editedName.length}/255 characters
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              disabled={loading}
            >
              <option value="HIGH">🔴 High Priority</option>
              <option value="MEDIUM">🟡 Medium Priority</option>
              <option value="LOW">🟢 Low Priority</option>
            </select>
          </div>

          {/* ✅ Status (NEW) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              disabled={loading}
            >
              <option value="QUEUED">⏳ Queued</option>
              <option value="IN_PROGRESS">⚙️ In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="FAILED">❌ Failed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading || editedName.trim().length < 3}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : '✓ Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📋</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  {task.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)} flex items-center`}>
                  <span className="mr-1">{getStatusIcon(task.status)}</span>
                  {task.status.replace('_', ' ')}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)} flex items-center`}>
                  <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Task ID</p>
              <p className="text-gray-800">#{task.id}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Status</p>
              <p className="text-gray-800">{task.status}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Created At</p>
              <p className="text-gray-800">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Last Updated</p>
              <p className="text-gray-800">{formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>
      )}

      {loading && !isEditing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          Processing...
        </div>
      )}
    </div>
  );
};

export default TaskItem;