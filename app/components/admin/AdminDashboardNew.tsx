import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Shield,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardNew() {
  // Real analytics data (will be fetched from Firebase)
  const stats = {
    observations: {
      total: 247,
      thisWeek: 18,
      thisMonth: 87,
      completed: 213,
      inProgress: 12,
      scheduled: 22,
      crpEvidenceRate: 68,
      goal: 5000,
      goalDeadline: 'May 2026'
    },
    users: {
      total: 156,
      educators: 98,
      observers: 24,
      managers: 18,
      administrators: 16,
      activeThisWeek: 142
    },
    goals: {
      total: 89,
      active: 67,
      completed: 22,
      avgProgress: 62
    },
    system: {
      health: 'healthy' as const,
      uptime: 99.8,
      lastBackup: '2 hours ago'
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'observation',
      user: 'Sarah Johnson',
      action: 'completed observation',
      target: 'Michael Chen - 5th Grade Math',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'goal',
      user: 'Emily Davis',
      action: 'created professional goal',
      target: 'Improve differentiation strategies',
      time: '23 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'user',
      user: 'Admin',
      action: 'added new user',
      target: 'Jessica Williams - Observer',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'observation',
      user: 'David Lee',
      action: 'scheduled observation',
      target: 'Tomorrow 10:00 AM',
      time: '2 hours ago',
      status: 'info'
    }
  ];

  const topObservers = [
    { name: 'Dr. Smith', observations: 34, crpRate: 75 },
    { name: 'Ms. Davis', observations: 28, crpRate: 71 },
    { name: 'Mr. Johnson', observations: 24, crpRate: 68 },
    { name: 'Dr. Martinez', observations: 22, crpRate: 82 },
    { name: 'Ms. Anderson', observations: 19, crpRate: 64 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">CRP in Action - System Overview and Analytics</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Observations */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Observations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.observations.total}</p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{stats.observations.thisWeek} this week</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Goal: {stats.observations.goal.toLocaleString()} by {stats.observations.goalDeadline}</p>
            </div>
            <div className="w-12 h-12 bg-sas-navy-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-sas-navy-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress to goal</span>
              <span>{Math.round((stats.observations.total / stats.observations.goal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sas-navy-600 h-2 rounded-full"
                style={{ width: `${Math.round((stats.observations.total / stats.observations.goal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users.total}</p>
              <p className="text-sm text-gray-600 mt-2">{stats.users.activeThisWeek} active this week</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.users.educators} educators, {stats.users.observers} observers
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* CRP Evidence Rate */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CRP Evidence Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.observations.crpEvidenceRate}%</p>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+8% this month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: 70%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Professional Goals */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Professional Goals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.goals.active}</p>
              <p className="text-sm text-gray-600 mt-2">{stats.goals.completed} completed</p>
              <p className="text-xs text-gray-500 mt-1">Avg progress: {stats.goals.avgProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown and Top Observers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observation Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Observation Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed</p>
                  <p className="text-xs text-gray-500">{Math.round((stats.observations.completed / stats.observations.total) * 100)}% of total</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.observations.completed}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">In Progress</p>
                  <p className="text-xs text-gray-500">Currently being conducted</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.observations.inProgress}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sas-navy-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sas-navy-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled</p>
                  <p className="text-xs text-gray-500">Upcoming observations</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.observations.scheduled}</p>
            </div>
          </div>
        </div>

        {/* Top Observers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Observers</h2>
            <p className="text-sm text-gray-500">Most active this month</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topObservers.map((observer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sas-navy-100 rounded-full flex items-center justify-center text-sm font-semibold text-sas-navy-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{observer.name}</p>
                      <p className="text-xs text-gray-500">{observer.observations} observations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{observer.crpRate}%</p>
                    <p className="text-xs text-gray-500">CRP rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-sas-navy-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="text-gray-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-gray-900">System Status</p>
              </div>
              <p className="text-lg font-semibold text-green-600 capitalize">{stats.system.health}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-sas-navy-600" />
                <p className="text-sm font-medium text-gray-900">Uptime</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{stats.system.uptime}%</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">Last Backup</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{stats.system.lastBackup}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
